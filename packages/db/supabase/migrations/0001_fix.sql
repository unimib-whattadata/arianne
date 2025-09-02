DROP ROLE "therapist";--> statement-breakpoint
DROP ROLE "patient";--> statement-breakpoint
ALTER TABLE "arianne_therapists" ALTER COLUMN "patient_ids" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "arianne_therapists" ALTER COLUMN "patient_ids" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_therapists" ALTER COLUMN "notes_ids" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "arianne_therapists" ALTER COLUMN "notes_ids" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_patients" ALTER COLUMN "notes_ids" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "arianne_patients" ALTER COLUMN "medical_records_ids" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "arianne_notifications" ALTER COLUMN "read" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_events" ALTER COLUMN "is_all_day" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_events" ALTER COLUMN "other_participants" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_events" ALTER COLUMN "patients_ids" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "arianne_events" ALTER COLUMN "patients_ids" SET NOT NULL;