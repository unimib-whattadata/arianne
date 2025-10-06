ALTER TABLE "arianne_personal_data" DROP CONSTRAINT "arianne_personal_data_patient_id_unique";--> statement-breakpoint
ALTER TABLE "arianne_personal_data" DROP CONSTRAINT "arianne_personal_data_patient_id_arianne_patients_id_fk";
--> statement-breakpoint
DROP INDEX "personal_data_patient_id";--> statement-breakpoint
ALTER TABLE "arianne_personal_data" ADD COLUMN "patient_profile_id" uuid;--> statement-breakpoint
ALTER TABLE "arianne_personal_data" ADD CONSTRAINT "arianne_personal_data_patient_profile_id_arianne_patients_profile_id_fk" FOREIGN KEY ("patient_profile_id") REFERENCES "public"."arianne_patients"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "personal_data_patient_profile_id" ON "arianne_personal_data" USING btree ("patient_profile_id");--> statement-breakpoint
ALTER TABLE "arianne_personal_data" DROP COLUMN "patient_id";--> statement-breakpoint
ALTER TABLE "arianne_personal_data" ADD CONSTRAINT "arianne_personal_data_patient_profile_id_unique" UNIQUE("patient_profile_id");