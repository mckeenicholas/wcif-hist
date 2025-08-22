CREATE TABLE "wcif_saves" (
	"id" serial PRIMARY KEY NOT NULL,
	"s3Key" text NOT NULL,
	"competitionId" text NOT NULL,
	"savedBy" integer NOT NULL,
	"savedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sessionId" varchar(32) PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"wcaToken" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"wcaId" varchar(10),
	"name" text NOT NULL,
	CONSTRAINT "users_wcaId_unique" UNIQUE("wcaId")
);
--> statement-breakpoint
ALTER TABLE "wcif_saves" ADD CONSTRAINT "wcif_saves_savedBy_users_id_fk" FOREIGN KEY ("savedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;