CREATE TABLE "arianne_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "arianne_participants" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "arianne_participants" ADD CONSTRAINT "arianne_participants_event_id_arianne_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."arianne_events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arianne_participants" ADD CONSTRAINT "arianne_participants_patient_id_arianne_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."arianne_patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "partecipant_id" ON "arianne_participants" USING btree ("id");