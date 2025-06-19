CREATE TABLE IF NOT EXISTS "applicants" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"status" text,
	"appliedDate" timestamp DEFAULT now() NOT NULL,
	"resumeUrl" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applicants" ADD CONSTRAINT "applicants_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
