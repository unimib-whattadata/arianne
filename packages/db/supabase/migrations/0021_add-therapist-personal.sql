CREATE TABLE "arianne_onboarding_therapist_personal" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"date_of_birth" date NOT NULL,
	"place_of_birth" varchar(150) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(50) NOT NULL,
	"gender" varchar(50) NOT NULL,
	"tax_code" varchar(50) NOT NULL,
	"education_degree" varchar(255) NOT NULL,
	"specialization" varchar(255) NOT NULL,
	"registration_number" integer NOT NULL,
	"province" varchar(100) NOT NULL,
	"registration_year" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "arianne_onboarding_therapist_personal" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "arianne_onboarding_therapist_personal" ADD CONSTRAINT "arianne_onboarding_therapist_personal_patient_id_arianne_therapists_profile_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."arianne_therapists"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "personal_forms_id_idx" ON "arianne_onboarding_therapist_personal" USING btree ("id");