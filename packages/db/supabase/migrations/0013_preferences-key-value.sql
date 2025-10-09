ALTER TABLE "arianne_preferences" RENAME COLUMN "values" TO "value";--> statement-breakpoint
ALTER TABLE "arianne_preferences" DROP CONSTRAINT "arianne_preferences_profile_id_arianne_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "arianne_preferences" ADD COLUMN "key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "arianne_preferences" ADD CONSTRAINT "arianne_preferences_profile_id_arianne_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."arianne_profiles"("id") ON DELETE cascade ON UPDATE no action;