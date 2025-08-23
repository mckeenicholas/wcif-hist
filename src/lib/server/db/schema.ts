import { integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
	id: serial().primaryKey(),
	wcaUserId: integer().notNull(),
	wcaId: varchar({ length: 10 }).unique(),
	name: text().notNull()
});

export const sessionsTable = pgTable('sessions', {
	sessionId: varchar({ length: 64 }).primaryKey(),
	userId: integer()
		.references(() => usersTable.id, { onDelete: 'cascade' })
		.notNull(),
	expiresAt: timestamp().notNull(),
	wcaToken: text().notNull()
});

export const savedWCIFInfoTable = pgTable('wcif_saves', {
	id: serial().primaryKey(),
	s3Key: text().notNull().unique(),
	competitionId: text().notNull(),
	competitionEndDate: timestamp().notNull(),
	description: text().notNull(),
	savedBy: integer()
		.references(() => usersTable.id, { onDelete: 'set null' })
		.notNull(),
	savedAt: timestamp().notNull()
});

export type User = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;

export type Session = typeof sessionsTable.$inferSelect;
export type SessionInsert = typeof sessionsTable.$inferInsert;

export type SavedWCIF = typeof savedWCIFInfoTable.$inferSelect;
