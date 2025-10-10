import { relations } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import z from "zod";

import { notes, participants, profiles, therapists } from "../schema";
import { createTable } from "../table";
import { medicalRecords } from "./medical-records";

/**
 * Patients table schema and its relations.
 */
export const patients = createTable(
  "patients",
  (d) => ({
    id: d.uuid().primaryKey().notNull().defaultRandom(),

    profileId: d
      .uuid("profile_id")
      .notNull()
      .unique()
      .references(() => profiles.id, { onDelete: "cascade" }),
    therapistId: d.uuid("therapist_id").references(() => therapists.id),
    personalInfoAdded: d
      .boolean("personal_info_added")
      .notNull()
      .default(false),
    questionnaireInfoAdded: d
      .boolean("questionnaire_info_added")
      .notNull()
      .default(false),

    medicalRecordsId: d.uuid("medical_records_id").notNull(),
  }),
  (t) => [index("patient_id").on(t.id)],
).enableRLS();

export const patientsRelations = relations(patients, ({ one, many }) => ({
  therapist: one(therapists, {
    fields: [patients.therapistId],
    references: [therapists.id],
  }),
  profile: one(profiles, {
    fields: [patients.profileId],
    references: [profiles.id],
  }),
  notes: many(notes),
  medicalRecords: one(medicalRecords, {
    fields: [patients.medicalRecordsId],
    references: [medicalRecords.id],
  }),
  events: many(participants),
}));

export const PatientsFindUniqueSchema = z.object({
  where: z.object({
    id: z.string().uuid(),
  }),
});

export const PatientsDeleteSchema = PatientsFindUniqueSchema;

export const PatientsFindRecentSchema = z.object({
  recent: z.array(z.string().uuid()),
});
