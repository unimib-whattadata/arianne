ALTER TABLE "arianne_chats" RENAME COLUMN "patient_id" TO "patient_profile_id";--> statement-breakpoint
ALTER TABLE "arianne_chats" RENAME COLUMN "therapist_id" TO "therapist_profile_id";--> statement-breakpoint
ALTER TABLE "arianne_chats" DROP CONSTRAINT "arianne_chats_patient_id_arianne_patients_id_fk";
--> statement-breakpoint
ALTER TABLE "arianne_chats" DROP CONSTRAINT "arianne_chats_therapist_id_arianne_therapists_id_fk";

ALTER TABLE "arianne_patients" ADD CONSTRAINT "arianne_patients_profile_id_unique" UNIQUE("profile_id");--> statement-breakpoint
ALTER TABLE "arianne_therapists" ADD CONSTRAINT "arianne_therapists_profile_id_unique" UNIQUE("profile_id");

--> statement-breakpoint
ALTER TABLE "arianne_chats" ADD CONSTRAINT "arianne_chats_patient_profile_id_arianne_patients_profile_id_fk" FOREIGN KEY ("patient_profile_id") REFERENCES "public"."arianne_patients"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_chats" ADD CONSTRAINT "arianne_chats_therapist_profile_id_arianne_therapists_profile_id_fk" FOREIGN KEY ("therapist_profile_id") REFERENCES "public"."arianne_therapists"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
