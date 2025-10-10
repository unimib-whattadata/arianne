ALTER TABLE "arianne_onboarding_therapist_personal" RENAME COLUMN "patient_id" TO "therapist_id";--> statement-breakpoint
ALTER TABLE "arianne_patients" DROP CONSTRAINT "arianne_patients_profile_id_arianne_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "arianne_therapists" DROP CONSTRAINT "arianne_therapists_profile_id_arianne_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "arianne_onboarding_therapist_personal" DROP CONSTRAINT "arianne_onboarding_therapist_personal_patient_id_arianne_therapists_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "arianne_patients" ADD CONSTRAINT "arianne_patients_profile_id_arianne_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."arianne_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_therapists" ADD CONSTRAINT "arianne_therapists_profile_id_arianne_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."arianne_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_onboarding_therapist_personal" ADD CONSTRAINT "arianne_onboarding_therapist_personal_therapist_id_arianne_therapists_profile_id_fk" FOREIGN KEY ("therapist_id") REFERENCES "public"."arianne_therapists"("profile_id") ON DELETE no action ON UPDATE no action;