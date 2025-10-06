import { relations } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";

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
    dateOfBirth: d.date("date_of_birth").notNull(),
    placeOfBirth: d.text(),
    alias: d.text(),
    pronouns: d.text(),
    gender: d.text(),
    sex: d.text(),
    work: d.text(),
    education: d.text(),
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
