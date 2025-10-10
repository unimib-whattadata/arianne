import { relations } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";

import { notes, patients } from "../schema";
import { createTable } from "../table";
import { profiles } from "./profiles";

/**
 * Therapists table schema and its relations.
 */
export const therapists = createTable(
  "therapists",
  (d) => ({
    id: d.uuid().primaryKey().notNull().defaultRandom(),

    profileId: d
      .uuid("profile_id")
      .notNull()
      .unique()
      .references(() => profiles.id),

    isOnboardingPreliminaryFinished: d
      .boolean("is_onboarding_preliminary_finished")
      .notNull()
      .default(false),
    isOnboardingPersonalFinished: d
      .boolean("is_onboarding_personal_finished")
      .notNull()
      .default(false),
    isOnboardingExperienceFinished: d
      .boolean("is_onboarding_experience_finished")
      .notNull()
      .default(false),
    isOnboardingTimeFinished: d
      .boolean("is_onboarding_time_finished")
      .notNull()
      .default(false),

    recentPatients: d.uuid("recent_patients").array().notNull().default([]),
  }),
  (t) => [index("therapist_id").on(t.id)],
).enableRLS();

export const therapistsRelations = relations(therapists, ({ many, one }) => ({
  patients: many(patients),
  profile: one(profiles, {
    fields: [therapists.profileId],
    references: [profiles.id],
  }),
  notes: many(notes),
}));
