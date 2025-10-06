CREATE TABLE "arianne_personal_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid,
	"name" text NOT NULL,
	"surname" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"placeOfBirth" text,
	"alias" text,
	"pronouns" text,
	"gender" text,
	"sex" text,
	"work" text,
	"education" text,
	"previousInterventions" text,
	CONSTRAINT "arianne_personal_data_patient_id_unique" UNIQUE("patient_id")
);
--> statement-breakpoint
ALTER TABLE "arianne_personal_data" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "arianne_diaries" ALTER COLUMN "content" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "arianne_patients" ADD COLUMN "personal_info_added" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_personal_data" ADD CONSTRAINT "arianne_personal_data_patient_id_arianne_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."arianne_patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "personal_data_patient_id" ON "arianne_personal_data" USING btree ("patient_id");