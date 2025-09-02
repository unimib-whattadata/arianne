CREATE TYPE "public"."diary_type" AS ENUM('sleep_morning', 'sleep_evening', 'cognitive_behavioral', 'food');--> statement-breakpoint
CREATE TYPE "public"."assignment_recurrence" AS ENUM('none', 'daily', 'weekly', 'monthly');--> statement-breakpoint
CREATE TYPE "public"."assignment_state" AS ENUM('assigned', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."assignment_type" AS ENUM('diary', 'administration', 'drugs');--> statement-breakpoint
CREATE TYPE "public"."weekday" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');--> statement-breakpoint
CREATE TYPE "public"."medical_record_caregiver_kinship" AS ENUM('Madre', 'Padre', 'Fratello', 'Sorella', 'Altro');--> statement-breakpoint
CREATE TYPE "public"."medical_record_parent_state" AS ENUM('alive', 'dead', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."medical_record_sex" AS ENUM('M', 'F');--> statement-breakpoint
CREATE TYPE "public"."medical_record_state" AS ENUM('incoming', 'ongoing', 'archived');--> statement-breakpoint
CREATE TYPE "public"."medical_record_type" AS ENUM('autonoma_presenza', 'intervista', 'accompagnatore');--> statement-breakpoint
CREATE TYPE "public"."notification_type_enum" AS ENUM('event_cancelled', 'event_modified', 'task_completed', 'administration_completed', 'diary_completed');--> statement-breakpoint
CREATE TYPE "public"."message_sender_type_enum" AS ENUM('therapist', 'patient');--> statement-breakpoint
CREATE ROLE "therapist" WITH CREATEDB CREATEROLE;--> statement-breakpoint
CREATE ROLE "patient" WITH CREATEDB CREATEROLE;--> statement-breakpoint
CREATE TABLE "arianne_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text,
	"address" text,
	"avatar_url" text,
	"role" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "arianne_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "arianne_therapists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"patient_ids" uuid[],
	"notes_ids" uuid[],
	"recent_patients" uuid[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "arianne_therapists" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "arianne_patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"therapist_id" uuid,
	"notes_ids" uuid[],
	"medical_records_ids" uuid[]
);
--> statement-breakpoint
ALTER TABLE "arianne_patients" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "arianne_diaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"type" "diary_type",
	"content" text NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"state" boolean DEFAULT false,
	"medical_record_id" uuid,
	"patient_id" uuid
);
--> statement-breakpoint
ALTER TABLE "arianne_diaries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "arianne_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"pinned" boolean DEFAULT false,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"therapist_id" uuid,
	"patient_id" uuid
);
--> statement-breakpoint
ALTER TABLE "arianne_notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "arianne_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "assignment_type",
	"name" text NOT NULL,
	"recurrence" "assignment_recurrence",
	"date" date NOT NULL,
	"recurrenceConfig" json,
	"state" "assignment_state" DEFAULT 'assigned',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"patient_id" uuid
);
--> statement-breakpoint
ALTER TABLE "arianne_assignments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "arianne_medical_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alias" text NOT NULL,
	"birth_date" date NOT NULL,
	"birth_place" text NOT NULL,
	"sex" "medical_record_sex",
	"gender" text NOT NULL,
	"pronoun" text NOT NULL,
	"occupation" text NOT NULL,
	"education" text NOT NULL,
	"other_notes" text NOT NULL,
	"caregivers" json,
	"tags" json,
	"mother_name" text NOT NULL,
	"motherStatus" "medical_record_parent_state",
	"father_name" text NOT NULL,
	"fatherStatus" "medical_record_parent_state",
	"parents_notes" text NOT NULL,
	"diagnostic_hypothesis" text NOT NULL,
	"simptoms" text NOT NULL,
	"reason" text NOT NULL,
	"previous_interventions" text NOT NULL,
	"clinical_data_notes" text NOT NULL,
	"state" "medical_record_state",
	"goals" text NOT NULL,
	"therapeutic_plan" text NOT NULL,
	"frequency" text NOT NULL,
	"taking_charge_date" date NOT NULL,
	"high_risk" boolean DEFAULT false,
	"patient_id" uuid,
	"administrations_ids" uuid[],
	"diaries_ids" uuid[]
);
--> statement-breakpoint
ALTER TABLE "arianne_medical_records" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "arianne_administration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"T" integer NOT NULL,
	"date" date DEFAULT now() NOT NULL,
	"type" text NOT NULL,
	"records" json NOT NULL,
	"therapist_name" text NOT NULL,
	"therapist_lastname" text NOT NULL,
	"modality" "medical_record_type",
	"created_at" date DEFAULT now() NOT NULL,
	"patient_id" uuid NOT NULL,
	"medical_record_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "arianne_administration" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "arianne_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "notification_type_enum" NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"read" boolean DEFAULT false,
	"created_at" date DEFAULT now() NOT NULL,
	"patient_id" uuid NOT NULL,
	"therapist_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "arianne_notifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "arianne_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"label_color" text NOT NULL,
	"date" date NOT NULL,
	"end_date" date,
	"meeting_link" text,
	"location" text,
	"description" text,
	"start_time" text,
	"end_time" text,
	"notification" text,
	"is_all_day" boolean DEFAULT false,
	"recurring" text,
	"other_participants" text[] DEFAULT '{}',
	"patients_ids" uuid[],
	"therapist_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "arianne_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "arianne_chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"last_index" integer NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL,
	"patient_id" uuid NOT NULL,
	"therapist_id" uuid NOT NULL,
	"messages" uuid[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "arianne_chats" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "arianne_messages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"senderType" "message_sender_type_enum",
	"index" integer NOT NULL,
	"initials" text NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL,
	"sender" uuid NOT NULL,
	"chat_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "arianne_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "arianne_profiles" ADD CONSTRAINT "profiles_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_therapists" ADD CONSTRAINT "arianne_therapists_profile_id_arianne_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."arianne_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_patients" ADD CONSTRAINT "arianne_patients_profile_id_arianne_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."arianne_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_patients" ADD CONSTRAINT "arianne_patients_therapist_id_arianne_therapists_id_fk" FOREIGN KEY ("therapist_id") REFERENCES "public"."arianne_therapists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_diaries" ADD CONSTRAINT "arianne_diaries_medical_record_id_arianne_medical_records_id_fk" FOREIGN KEY ("medical_record_id") REFERENCES "public"."arianne_medical_records"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_diaries" ADD CONSTRAINT "arianne_diaries_patient_id_arianne_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."arianne_patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_notes" ADD CONSTRAINT "arianne_notes_therapist_id_arianne_therapists_id_fk" FOREIGN KEY ("therapist_id") REFERENCES "public"."arianne_therapists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_notes" ADD CONSTRAINT "arianne_notes_patient_id_arianne_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."arianne_patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_assignments" ADD CONSTRAINT "arianne_assignments_patient_id_arianne_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."arianne_patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_medical_records" ADD CONSTRAINT "arianne_medical_records_patient_id_arianne_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."arianne_patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_administration" ADD CONSTRAINT "arianne_administration_patient_id_arianne_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."arianne_patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_administration" ADD CONSTRAINT "arianne_administration_medical_record_id_arianne_medical_records_id_fk" FOREIGN KEY ("medical_record_id") REFERENCES "public"."arianne_medical_records"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_notifications" ADD CONSTRAINT "arianne_notifications_patient_id_arianne_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."arianne_patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_notifications" ADD CONSTRAINT "arianne_notifications_therapist_id_arianne_therapists_id_fk" FOREIGN KEY ("therapist_id") REFERENCES "public"."arianne_therapists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_events" ADD CONSTRAINT "arianne_events_therapist_id_arianne_therapists_id_fk" FOREIGN KEY ("therapist_id") REFERENCES "public"."arianne_therapists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_chats" ADD CONSTRAINT "arianne_chats_patient_id_arianne_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."arianne_patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_chats" ADD CONSTRAINT "arianne_chats_therapist_id_arianne_therapists_id_fk" FOREIGN KEY ("therapist_id") REFERENCES "public"."arianne_therapists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_messages" ADD CONSTRAINT "arianne_messages_sender_users_id_fk" FOREIGN KEY ("sender") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_messages" ADD CONSTRAINT "arianne_messages_chat_id_arianne_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."arianne_chats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "therapist_id" ON "arianne_therapists" USING btree ("id");--> statement-breakpoint
CREATE INDEX "patient_id" ON "arianne_patients" USING btree ("id");--> statement-breakpoint
CREATE INDEX "diary_id" ON "arianne_diaries" USING btree ("id");--> statement-breakpoint
CREATE INDEX "note_id" ON "arianne_notes" USING btree ("id");--> statement-breakpoint
CREATE INDEX "assignment_id" ON "arianne_assignments" USING btree ("id");--> statement-breakpoint
CREATE INDEX "medical_record_id" ON "arianne_medical_records" USING btree ("id");--> statement-breakpoint
CREATE INDEX "administration_id" ON "arianne_administration" USING btree ("id");--> statement-breakpoint
CREATE INDEX "notification_id" ON "arianne_notifications" USING btree ("id");--> statement-breakpoint
CREATE INDEX "event_id" ON "arianne_events" USING btree ("id");--> statement-breakpoint
CREATE INDEX "chat_id" ON "arianne_chats" USING btree ("id");--> statement-breakpoint
CREATE INDEX "message_id" ON "arianne_messages" USING btree ("id");