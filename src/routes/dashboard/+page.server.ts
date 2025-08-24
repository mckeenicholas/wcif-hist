import { getWCAToken } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const wcaToken = await getWCAToken(event.locals.session!);

	const [userInfo] = await db
		.select({ name: usersTable.name, wcaId: usersTable.wcaId })
		.from(usersTable)
		.where(eq(usersTable.id, event.locals.user.id));

	return { ...userInfo, wcaToken };
};
