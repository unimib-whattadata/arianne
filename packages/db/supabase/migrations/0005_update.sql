CREATE TYPE "public"."assignment_modality" AS ENUM('autonoma_presenza', 'intervista', 'accompagnatore');--> statement-breakpoint
CREATE TABLE "arianne_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"values" jsonb DEFAULT '{"notifications":{"patientMessages":true,"assignmentCompleted":true,"eventModified":true,"eventCancelled":true},"patients":{}}'::jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "arianne_preferences" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "arianne_patients" RENAME COLUMN "medical_records_ids" TO "medical_records_id";--> statement-breakpoint
ALTER TABLE "arianne_diaries" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_notes" ALTER COLUMN "date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "arianne_notes" ALTER COLUMN "pinned" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_notes" ALTER COLUMN "therapist_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_notes" ALTER COLUMN "patient_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_assignments" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_assignments" ALTER COLUMN "recurrence" SET DEFAULT 'none';--> statement-breakpoint
ALTER TABLE "arianne_assignments" ALTER COLUMN "recurrence" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_medical_records" ALTER COLUMN "sex" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_medical_records" ALTER COLUMN "caregivers" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "arianne_medical_records" ALTER COLUMN "caregivers" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_medical_records" ALTER COLUMN "tags" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "arianne_medical_records" ALTER COLUMN "tags" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_medical_records" ALTER COLUMN "state" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_medical_records" ALTER COLUMN "high_risk" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_administration" DROP COLUMN "modality";--> statement-breakpoint
ALTER TABLE "arianne_administration" ADD COLUMN "modality" assignment_modality;--> statement-breakpoint
ALTER TABLE "arianne_administration" ALTER COLUMN "modality" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_messages" ALTER COLUMN "senderType" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_preferences" ADD CONSTRAINT "arianne_preferences_profile_id_arianne_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."arianne_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "preference_id" ON "arianne_preferences" USING btree ("id");--> statement-breakpoint
ALTER TABLE "arianne_chats" DROP COLUMN "messages";--> statement-breakpoint
DROP TYPE "public"."medical_record_type";