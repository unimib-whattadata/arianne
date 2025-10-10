CREATE TYPE "public"."form_path" AS ENUM('individual', 'couple', 'family');--> statement-breakpoint
CREATE TYPE "public"."form_step" AS ENUM('step1', 'step2', 'step3', 'path', 'final', 'completed');--> statement-breakpoint
CREATE TABLE "arianne_form_flows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid,
	"currentStep" "form_step" DEFAULT 'step1' NOT NULL,
	"path" "form_path",
	"step1" jsonb,
	"step2" jsonb,
	"step3" jsonb,
	"individual" jsonb,
	"couple" jsonb,
	"family" jsonb,
	"final" jsonb,
	"completed" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "arianne_form_flows" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "arianne_assignments" ALTER COLUMN "patient_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_assignments" ALTER COLUMN "therapist_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_diaries" DROP COLUMN "content";--> statement-breakpoint
ALTER TABLE "arianne_diaries" ADD COLUMN "content" json;--> statement-breakpoint
ALTER TABLE "arianne_form_flows" ADD CONSTRAINT "arianne_form_flows_patient_id_arianne_patients_profile_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."arianne_patients"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "form_flow_id" ON "arianne_form_flows" USING btree ("id");