import { db } from '$lib/server/db';
import type { SessionInsert } from '$lib/server/db/schema';
import { sessionsTable, usersTable } from '$lib/server/db/schema';
import { createServerLog } from '$lib/server/serverUtils';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';
import { eq, lt } from 'drizzle-orm';

const DAY_MS = 1000 * 60 * 60 * 24;
const SESSION_LENGTH_DAYS = 7;
// const SESSION_RENEW_THRESHOLD_DAYS = 1;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: number, wcaToken: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const session: SessionInsert = {
		sessionId,
		wcaToken,
		userId,
		expiresAt: new Date(Date.now() + DAY_MS * SESSION_LENGTH_DAYS)
	};

	await db.insert(sessionsTable).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const providedSessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			user: { id: usersTable.id },
			sessionId: sessionsTable.sessionId,
			expiresAt: sessionsTable.expiresAt
		})
		.from(sessionsTable)
		.innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
		.where(eq(sessionsTable.sessionId, providedSessionId));

	if (!result) {
		return { session: null, user: null, expiresAt: null };
	}

	const { sessionId, user, expiresAt } = result;

	const sessionExpired = Date.now() >= expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(sessionsTable).where(eq(sessionsTable.sessionId, sessionId));
		return { session: null, user: null, expiresAt: null };
	}

	// const renewSession = Date.now() >= expiresAt.getTime() - DAY_MS * SESSION_RENEW_THRESHOLD_DAYS;
	// if (renewSession) {
	// 	const newExpiryDate = new Date(Date.now() + DAY_MS * SESSION_LENGTH_DAYS);
	// 	await db
	// 		.update(sessionsTable)
	// 		.set({ expiresAt: newExpiryDate })
	// 		.where(eq(sessionsTable.sessionId, sessionId));
	// }

	return { session: sessionId, user, expiresAt };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(providedSessionId: string) {
	await db.delete(sessionsTable).where(eq(sessionsTable.sessionId, providedSessionId));
}

export async function getWCAToken(sessionId: string) {
	const [row] = await db
		.select({ wcaToken: sessionsTable.wcaToken })
		.from(sessionsTable)
		.where(eq(sessionsTable.sessionId, sessionId));

	return row.wcaToken;
}

export async function deleteExpiredSessions(): Promise<void> {
	createServerLog('Starting expired session token cleanup...');
	try {
		const now = new Date();
		await db.delete(sessionsTable).where(lt(sessionsTable.expiresAt, now));

		createServerLog(`Successfully deleted expired session tokens.`);
	} catch (error) {
		createServerLog(`Failed to delete expired session tokens. Error: ${error}`, 'error');
	}
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}
