CREATE TABLE "onboarding_therapist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid,
	"nome" varchar(100) NOT NULL,
	"cognome" varchar(100) NOT NULL,
	"email" varchar(150) NOT NULL,
	"numero_iscrizione" varchar(50) NOT NULL,
	"orientamento_terapeutico" varchar(150) NOT NULL,
	"specializzazione" varchar(150) NOT NULL,
	"anni_esperienza" varchar(10) NOT NULL,
	"dove_esercita" varchar(150) NOT NULL,
	"paese" varchar(100) NOT NULL,
	"citta" varchar(100) NOT NULL,
	"provincia" varchar(100) NOT NULL,
	"cap" varchar(20) NOT NULL,
	"termini_accettati" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "onboarding_therapist" ADD CONSTRAINT "onboarding_therapist_patient_id_arianne_therapists_profile_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."arianne_therapists"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "onboarding_email_idx" ON "onboarding_therapist" USING btree ("email");