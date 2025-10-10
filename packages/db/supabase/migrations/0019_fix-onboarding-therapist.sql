ALTER TABLE "onboarding_therapist" ADD COLUMN "name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "onboarding_therapist" ADD COLUMN "surname" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "onboarding_therapist" ADD COLUMN "subscription_number" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "onboarding_therapist" ADD COLUMN "therapeutic_orientation" varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE "onboarding_therapist" ADD COLUMN "specialization" varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE "onboarding_therapist" ADD COLUMN "experience_years" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "onboarding_therapist" ADD COLUMN "location" varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE "onboarding_therapist" ADD COLUMN "country" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "onboarding_therapist" ADD COLUMN "city" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "onboarding_therapist" ADD COLUMN "province" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "onboarding_therapist" ADD COLUMN "acceptance_conditions" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "onboarding_therapist" DROP COLUMN "nome";--> statement-breakpoint
ALTER TABLE "onboarding_therapist" DROP COLUMN "cognome";--> statement-breakpoint
ALTER TABLE "onboarding_therapist" DROP COLUMN "numero_iscrizione";--> statement-breakpoint
ALTER TABLE "onboarding_therapist" DROP COLUMN "orientamento_terapeutico";--> statement-breakpoint
ALTER TABLE "onboarding_therapist" DROP COLUMN "specializzazione";--> statement-breakpoint
ALTER TABLE "onboarding_therapist" DROP COLUMN "anni_esperienza";--> statement-breakpoint
ALTER TABLE "onboarding_therapist" DROP COLUMN "dove_esercita";--> statement-breakpoint
ALTER TABLE "onboarding_therapist" DROP COLUMN "paese";--> statement-breakpoint
ALTER TABLE "onboarding_therapist" DROP COLUMN "citta";--> statement-breakpoint
ALTER TABLE "onboarding_therapist" DROP COLUMN "provincia";--> statement-breakpoint
ALTER TABLE "onboarding_therapist" DROP COLUMN "termini_accettati";