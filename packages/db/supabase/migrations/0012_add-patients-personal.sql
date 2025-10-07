CREATE TABLE "arianne_personal_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_profile_id" uuid,
	"name" text NOT NULL,
	"surname" text NOT NULL,
	"date" date NOT NULL,
	"placeOfBirth" text NOT NULL,
	"alias" text NOT NULL,
	"pronouns" text NOT NULL,
	"gender" text NOT NULL,
	"sex" text NOT NULL,
	"work" text NOT NULL,
	"education" text NOT NULL,
	"previousInterventions" text,
	CONSTRAINT "arianne_personal_data_patient_profile_id_unique" UNIQUE("patient_profile_id")
);
--> statement-breakpoint
ALTER TABLE "arianne_personal_data" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "arianne_patients" ADD COLUMN "personal_info_added" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_personal_data" ADD CONSTRAINT "arianne_personal_data_patient_profile_id_arianne_patients_profile_id_fk" FOREIGN KEY ("patient_profile_id") REFERENCES "public"."arianne_patients"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "personal_data_patient_profile_id" ON "arianne_personal_data" USING btree ("patient_profile_id");