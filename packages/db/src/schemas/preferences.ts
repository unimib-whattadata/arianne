import { relations } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import z from "zod";

import { profiles } from "../schema";
import { createTable } from "../table";

export const preferences = createTable(
  "preferences",
  (d) => ({
    id: d.uuid().primaryKey().notNull().defaultRandom(),

    profileId: d
      .uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),

    key: d.text().notNull(),
    value: d.jsonb().notNull(),
  }),
  (t) => [index("preference_id").on(t.id)],
).enableRLS();

export const preferencesRelations = relations(preferences, ({ one }) => ({
  profile: one(profiles, {
    fields: [preferences.profileId],
    references: [profiles.id],
  }),
}));

export const getPreferencesSchema = z.discriminatedUnion("key", [
  z.object({
    key: z.literal("notifications"),
  }),
  z.object({
    key: z.literal("favoritesAdministrations"),
    patientId: z.string().uuid().optional(),
  }),
]);

export const setPreferenceSchema = z.discriminatedUnion("key", [
  z.object({
    key: z.literal("notifications"),
    value: z.object({
      patientMessages: z.boolean().default(true),
      assignmentCompleted: z.boolean().default(true),
      eventModified: z.boolean().default(true),
      eventCancelled: z.boolean().default(true),
    }),
  }),
  z.object({
    key: z.literal("favoritesAdministrations"),
    value: z.object({
      patientId: z.string().uuid(),
      data: z.array(z.string()),
    }),
  }),
]);
