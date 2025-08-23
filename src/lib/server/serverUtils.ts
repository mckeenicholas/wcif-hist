import { R2Storage } from '$lib/s3/client';
import { eq, lt } from 'drizzle-orm';
import { db } from './db';
import { savedWCIFInfoTable } from './db/schema';

const CLEANUP_THRESHOLD_WEEKS = 2;

export const createServerLog = (message: string, level: 'log' | 'error' = 'log') => {
	const timestamp = new Date().toISOString();
	if (level === 'error') {
		console.error(`[${timestamp}] ${message}`);
	} else {
		console.log(`[${timestamp}] ${message}`);
	}
};

export async function cleanupOldCompetitions(): Promise<void> {
	createServerLog('Starting old competition cleanup...');

	const r2Storage = R2Storage.getInstance();

	try {
		const twoWeeksAgo = new Date();
		twoWeeksAgo.setDate(twoWeeksAgo.getDate() - CLEANUP_THRESHOLD_WEEKS * 7);

		createServerLog(`Looking for competitions that ended before: ${twoWeeksAgo.toISOString()}`);

		const competitionsToDelete = await db
			.select()
			.from(savedWCIFInfoTable)
			.where(lt(savedWCIFInfoTable.competitionEndDate, twoWeeksAgo));

		createServerLog(`Found ${competitionsToDelete.length} competitions to process for deletion.`);

		for (const competition of competitionsToDelete) {
			try {
				createServerLog(
					`Attempting to delete data for competition ID: ${competition.id}, S3 Key: ${competition.s3Key}`
				);

				await r2Storage.deleteContent(competition.s3Key);
				createServerLog(`Successfully deleted S3 object: ${competition.s3Key}`);

				await db.delete(savedWCIFInfoTable).where(eq(savedWCIFInfoTable.id, competition.id));
				createServerLog(`Successfully deleted DB entry for competition ID: ${competition.id}`);
			} catch (individualDeletionError) {
				createServerLog(
					`Failed to delete data for competition ID: ${competition.id} (S3 Key: ${competition.s3Key}). Error: ${individualDeletionError}`,
					'error'
				);
			}
		}
		createServerLog('Old competition cleanup finished successfully.');
	} catch (mainError) {
		createServerLog(
			'An error occurred during the overall old competition cleanup process:',
			'error'
		);
		console.error(mainError);
	}
}
