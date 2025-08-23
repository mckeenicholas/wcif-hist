import * as auth from '$lib/server/auth.js';
import { cleanupOldCompetitions, createServerLog } from '$lib/server/serverUtils';
import type { Handle } from '@sveltejs/kit';
import { scheduleJob } from 'node-schedule';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user, expiresAt } = await auth.validateSessionToken(sessionToken);

	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};

export const handle: Handle = handleAuth;

export function scheduleSessionCleanup(): void {
	createServerLog('Scheduling weekly session cleanup...');
	scheduleJob('0 0 * * 0', async () => {
		// Run every Sunday at midnight
		createServerLog('Running scheduled session cleanup job...');
		await auth.deleteExpiredSessions();
		await cleanupOldCompetitions();
	});
}

scheduleSessionCleanup();
