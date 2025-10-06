import { relations } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import z from "zod";

import { patients } from "../schema";
import { createTable } from "../table";

export const personalData = createTable(
  "personal_data",
  (d) => ({
    id: d.uuid().primaryKey().notNull().defaultRandom(),

    patientProfileId: d
      .uuid("patient_profile_id")
      .unique()
      .references(() => patients.profileId, { onDelete: "cascade" }),

    name: d.text().notNull(),
    surname: d.text().notNull(),
    dateOfBirth: d.date("date", { mode: "date" }).notNull(),
    placeOfBirth: d.text().notNull(),
    alias: d.text().notNull(),
    pronouns: d.text().notNull(),
    gender: d.text().notNull(),
    sex: d.text().notNull(),
    work: d.text().notNull(),
    education: d.text().notNull(),
    previousInterventions: d.text(),
  }),
  (t) => [index("personal_data_patient_profile_id").on(t.patientProfileId)],
).enableRLS();

export const personalDataRelations = relations(personalData, ({ one }) => ({
  patient: one(patients, {
    fields: [personalData.patientProfileId],
    references: [patients.profileId],
  }),
}));

export const PersonalDataCreateSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  dateOfBirth: z.date(),
  placeOfBirth: z.string(),
  alias: z.string(),
  pronouns: z.string(),
  gender: z.string(),
  sex: z.string(),
  work: z.string(),
  education: z.string(),
  previousInterventions: z.string().optional(),
});
