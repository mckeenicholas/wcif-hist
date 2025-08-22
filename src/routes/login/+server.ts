import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { usersTable } from '$lib/server/db/schema';
import type { WCAUserResponseInfo } from '$lib/types';
import { authFetch } from '$lib/util.js';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function POST(event) {
	const body = await event.request.json();
	const { wcaToken } = body;

	if (!wcaToken) {
		return json({ error: 'WCA token is required' }, { status: 400 });
	}

	const response = await authFetch('https://api.worldcubeassociation.org/me', wcaToken.toString());

	if (!response.ok) {
		return json({ error: 'Invalid WCA token' }, { status: 401 });
	}

	const wcaData = (await response.json()) as WCAUserResponseInfo;
	const { name, id, wca_id: wcaId } = wcaData.me;

	const existingUser = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.wcaId, wcaId))
		.limit(1);

	let userId: number;

	if (existingUser.length === 0) {
		const insertResult = await db
			.insert(usersTable)
			.values({
				name,
				wcaUserId: id,
				wcaId: wcaId
			})
			.returning({ id: usersTable.id });

		userId = insertResult[0].id;
	} else {
		userId = existingUser[0].id;
	}

	const session = await auth.generateSessionToken();
	const { expiresAt } = await auth.createSession(session, userId, wcaToken);

	auth.setSessionTokenCookie(event, session, expiresAt);

	return json({ success: true, name, wcaId });
}
