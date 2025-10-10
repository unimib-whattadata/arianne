ALTER TABLE "onboarding_therapist" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "arianne_therapists" ADD COLUMN "is_onboarding_preliminary_finished" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_therapists" ADD COLUMN "is_onboarding_personal_finished" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_therapists" ADD COLUMN "is_onboarding_experience_finished" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_therapists" ADD COLUMN "is_onboarding_time_finished" boolean DEFAULT false NOT NULL;