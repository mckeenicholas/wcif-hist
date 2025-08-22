import { db } from '$lib/server/db';
import { savedWCIFInfoTable, usersTable } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
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
