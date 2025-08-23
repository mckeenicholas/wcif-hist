import { R2Storage } from '$lib/s3/client';
import { getWCAToken } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { savedWCIFInfoTable, usersTable } from '$lib/server/db/schema';
import type { Competition } from '$lib/types/wcif';
import { authFetch } from '$lib/util';
import { redirect, type Actions } from '@sveltejs/kit';
import { error } from 'console';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

const getSavedVersions = async (competitionId: string) => {
	return await db
		.select({
			id: savedWCIFInfoTable.id,
			savedAt: savedWCIFInfoTable.savedAt,
			description: savedWCIFInfoTable.description,
			savedBy: usersTable.name
		})
		.from(savedWCIFInfoTable)
		.innerJoin(usersTable, eq(savedWCIFInfoTable.savedBy, usersTable.id))
		.where(eq(savedWCIFInfoTable.competitionId, competitionId));
};

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const savedVersions = await getSavedVersions(event.params.competitionId);

	const wcifData = '';

	return { savedVersions, wcifData };
};

export const actions = {
	default: async (event) => {
		if (!event.locals.user) {
			return redirect(302, 'login');
		}

		const competitionId = event.params.competitionId;

		if (!competitionId) {
			return error(400, 'Invalid competition id');
		}

		const data = await event.request.formData();
		const description = data.get('description') ?? '';

		const userToken = await getWCAToken(event.locals.session!);
		const wcifResponse = await authFetch(
			`https://api.worldcubeassociation.org/competitions/${competitionId}/wcif`,
			userToken
		);
		const wcifData: Competition = await wcifResponse.json();

		const userId = event.locals.user.id;

		const itemKey = R2Storage.generateKey(competitionId, userId, new Date());
		const client = R2Storage.getInstance();

		const savedAt = new Date();

		try {
			await client.putContent(itemKey, JSON.stringify(wcifData));

			await db.insert(savedWCIFInfoTable).values({
				s3Key: itemKey,
				competitionId,
				description: description.toString(),
				savedBy: userId,
				savedAt
			});
		} catch (error) {
			console.log(error);
		}
	}
} satisfies Actions;
