import { relations } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import z from "zod";

import { profiles } from "../schema";
import { createTable } from "../table";

const profilePreferencesValuesSchema = z.object({
  notifications: z.object({
    patientMessages: z.boolean().default(true),
    assignmentCompleted: z.boolean().default(true),
    eventModified: z.boolean().default(true),
    eventCancelled: z.boolean().default(true),
  }),
});

const patientsPreferencesValuesSchema = z.object({
  favoriteAdministrations: z.array(z.string().uuid()).default([]),
});

export const preferenceValuesSchema = z.object({
  ...profilePreferencesValuesSchema.shape,
  patients: z.map(
    z.string().uuid(),
    z.object(patientsPreferencesValuesSchema.shape),
  ),
});
export type PreferenceValues = z.infer<typeof preferenceValuesSchema>;

export const preferenceValuesUpdateSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("patient"),
    patientId: z.string().uuid(),
    values: z.object(patientsPreferencesValuesSchema.partial().shape),
  }),
  z.object({
    type: z.literal("profile"),
    values: z.object(profilePreferencesValuesSchema.partial().shape),
  }),
]);

export const defaultValues: PreferenceValues = {
  notifications: {
    patientMessages: true,
    assignmentCompleted: true,
    eventModified: true,
    eventCancelled: true,
  },
  patients: new Map(),
};

export const preferences = createTable(
  "preferences",
  (d) => ({
    id: d.uuid().primaryKey().notNull().defaultRandom(),

    profileId: d
      .uuid("profile_id")
      .notNull()
      .references(() => profiles.id),
    values: d
      .jsonb()
      .$type<PreferenceValues>()
      .notNull()
      .default(defaultValues),
  }),
  (t) => [index("preference_id").on(t.id)],
).enableRLS();

export const preferencesRelations = relations(preferences, ({ one }) => ({
  profile: one(profiles, {
    fields: [preferences.profileId],
    references: [profiles.id],
  }),
}));
