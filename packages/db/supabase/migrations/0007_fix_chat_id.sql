ALTER TABLE "arianne_messages" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "arianne_medical_records" ALTER COLUMN "motherStatus" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_medical_records" ALTER COLUMN "fatherStatus" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_medical_records" ALTER COLUMN "patient_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_medical_records" DROP COLUMN "administrations_ids";--> statement-breakpoint
ALTER TABLE "arianne_medical_records" DROP COLUMN "diaries_ids";--> statement-breakpoint
ALTER TABLE "arianne_patients" DROP COLUMN "notes_ids";--> statement-breakpoint
ALTER TABLE "arianne_therapists" DROP COLUMN "notes_ids";