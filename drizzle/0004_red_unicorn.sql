ALTER TABLE "wcif_saves" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "wcif_saves" ADD CONSTRAINT "wcif_saves_s3Key_unique" UNIQUE("s3Key");