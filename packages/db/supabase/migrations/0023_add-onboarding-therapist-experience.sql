CREATE TABLE "arianne_onboarding_therapist_experience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"therapist_id" uuid,
	"work_mode" varchar(150) NOT NULL,
	"experience_years" integer NOT NULL,
	"description" text NOT NULL,
	"therapeutic_orientation" varchar(255) NOT NULL,
	"languages" varchar(255) NOT NULL,
	"clinical_specialization" varchar(255) NOT NULL,
	"skills" varchar(255) NOT NULL,
	"categories" text[] NOT NULL,
	"age_ranges" text[] NOT NULL,
	"address" varchar(255) NOT NULL,
	"country" varchar(100) NOT NULL,
	"province" varchar(100) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "arianne_onboarding_therapist_experience" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "arianne_onboarding_therapist_experience" ADD CONSTRAINT "arianne_onboarding_therapist_experience_therapist_id_arianne_therapists_profile_id_fk" FOREIGN KEY ("therapist_id") REFERENCES "public"."arianne_therapists"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "onboarding_therapist_experience_id_idx" ON "arianne_onboarding_therapist_experience" USING btree ("id");