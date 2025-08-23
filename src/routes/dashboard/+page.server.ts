import { getWCAToken } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schema';
import type { Competition } from '$lib/types';
import { authFetch } from '$lib/util';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

const getUpcomingCompetitions = async (sessionId: string) => {
	const wcaToken = await getWCAToken(sessionId);

	const url = new URL('https://www.worldcubeassociation.org/api/v0/competitions');
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - 14);

	url.searchParams.append('managed_by_me', 'true');
	url.searchParams.append('start', startDate.toISOString());
	url.searchParams.append('sort', 'start_date');

	const response = await authFetch(url, wcaToken);

	console.log(response);

	if (!response.ok) {
		throw Error('Invalid or expired WCA Token');
	}

	const data: Competition[] = await response.json();
	return data;
};

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const [userInfo] = await db
		.select({ name: usersTable.name, wcaId: usersTable.wcaId })
		.from(usersTable)
		.where(eq(usersTable.id, event.locals.user.id));

	try {
		const upcomingCompetitions = await getUpcomingCompetitions(event.locals.session!);

		return {
			error: false,
			...userInfo,
			competitions: upcomingCompetitions
		};
	} catch (error) {
		return { error: true, message: `${error}` };
	}
};
