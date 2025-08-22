import { db } from '$lib/server/db';
import { savedWCIFInfoTable, usersTable } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

const getSaveInfo = async (saveId: number) => {
	const response = await db
		.select({
			s3Key: savedWCIFInfoTable.s3Key,
			savedAt: savedWCIFInfoTable.savedAt,
			description: savedWCIFInfoTable.description,
			savedByName: usersTable.name
		})
		.from(savedWCIFInfoTable)
		.innerJoin(usersTable, eq(savedWCIFInfoTable.savedBy, usersTable.id))
		.where(eq(savedWCIFInfoTable.id, saveId));

	if (response.length == 0) {
		throw error(404, 'Save not found');
	}

	return response[0];
};

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const saveId = parseInt(event.params.saveId);
	if (Number.isNaN(saveId)) {
		throw error(400, 'Invalid save id');
	}

	const savedData = await getSaveInfo(saveId);

	return { ...savedData };
};
