ALTER TABLE "arianne_onboarding_therapist_experience" ALTER COLUMN "address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_onboarding_therapist_experience" ALTER COLUMN "country" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_onboarding_therapist_experience" ALTER COLUMN "province" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_therapists" ADD COLUMN "availability" jsonb DEFAULT '{}'::jsonb;