import { relations } from "drizzle-orm";
import { getTableConfig, index, pgEnum } from "drizzle-orm/pg-core";
import z from "zod";

import { administrations, patients } from "../schema";
import { createTable } from "../table";
import { diaries } from "./diaries";

export const medicalRecordSexEnum = pgEnum("medical_record_sex", ["M", "F"]);
export const medicalRecordParentStateEnum = pgEnum(
  "medical_record_parent_state",
  ["alive", "dead", "unknown"],
);
export const medicalRecordStateEnum = pgEnum("medical_record_state", [
  "incoming",
  "ongoing",
  "archived",
]);

export interface Caregiver {
  name: string;
  kinship: "Madre" | "Padre" | "Fratello" | "Sorella" | "Altro";
}

export const medicalRecordCaregiverKinshipEnum = pgEnum(
  "medical_record_caregiver_kinship",
  ["Madre", "Padre", "Fratello", "Sorella", "Altro"],
);

export interface Tag {
  text: string;
}

/**
 * Medical Records Schema and its relations.
 */
export const medicalRecords = createTable(
  "medical_records",
  (d) => ({
    id: d.uuid().primaryKey().notNull().defaultRandom(),
    alias: d.text("alias").notNull(),
    birthDate: d.date("birth_date", { mode: "date" }).notNull(),
    birthPlace: d.text("birth_place").notNull(),
    sex: medicalRecordSexEnum().notNull(),
    gender: d.text("gender").notNull(),
    pronoun: d.text("pronoun").notNull(),
    occupation: d.text("occupation").notNull(),
    education: d.text("education").notNull(),
    otherNotes: d.text("other_notes").notNull(),
    caregivers: d.json().$type<Caregiver[]>().notNull().default([]),
    tags: d.json().$type<Tag[]>().notNull().default([]),
    motherName: d.text("mother_name").notNull(),
    motherStatus: medicalRecordParentStateEnum().notNull(),
    fatherName: d.text("father_name").notNull(),
    fatherStatus: medicalRecordParentStateEnum().notNull(),
    parentsNotes: d.text("parents_notes").notNull(),
    diagnosticHypothesis: d.text("diagnostic_hypothesis").notNull(),
    simptoms: d.text("simptoms").notNull(),
    reason: d.text("reason").notNull(),
    previousInterventions: d.text("previous_interventions").notNull(),
    clinicalDataNotes: d.text("clinical_data_notes").notNull(),
    state: medicalRecordStateEnum().notNull(),
    goals: d.text("goals").notNull(),
    therapeuticPlan: d.text("therapeutic_plan").notNull(),
    frequency: d.text("frequency").notNull(),
    takingChargeDate: d.date("taking_charge_date", { mode: "date" }).notNull(),
    highRisk: d.boolean("high_risk").notNull().default(false),

    patientId: d
      .uuid("patient_id")
      .notNull()
      .references(() => patients.id),
  }),
  (t) => [index("medical_record_id").on(t.id)],
).enableRLS();

export const medicalRecordsRelations = relations(
  medicalRecords,
  ({ one, many }) => ({
    patient: one(patients, {
      fields: [medicalRecords.patientId],
      references: [patients.id],
    }),
    administrations: many(administrations),
    diaries: many(diaries),
  }),
);

type MedicalRecord = typeof medicalRecords.$inferSelect;
type col = keyof typeof medicalRecords.$inferSelect;
const { columns } = getTableConfig(medicalRecords);

const cols = Object.keys(columns) as [col];

export const MedicalRecordsFindUniqueSchema = z.object({
  where: z.object({
    id: z.string().uuid(),
  }),
  columns: z.record(z.enum(cols), z.boolean()).optional(),
});

export const MedicalRecordsUpdateSchema = z.object({
  where: z.object({
    patientId: z.string().uuid(),
  }),
  data: z.custom<Partial<MedicalRecord>>((val: Record<string, unknown>) => {
    return (
      typeof val === "object" &&
      val.id === undefined &&
      Object.keys(val).length > 0
    );
  }),
});

export const ProfileSchema = z.object({
  user: z.object({
    firstName: z
      .string()
      .min(1, { message: "Il nome è obbligatorio" })
      .max(50, { message: "Il nome deve essere inferiore a 50 caratteri" }),
    lastName: z
      .string()
      .min(1, { message: "Il cognome è obbligatorio" })
      .max(50, { message: "Il cognome deve essere inferiore a 50 caratteri" }),

    gender: z.string().optional(),
    birthDate: z
      .date()
      .refine((date) => date <= new Date(), {
        message: "La data di nascita deve essere nel passato",
      })

      .optional(),
    birthPlace: z.string().optional(),
  }),
  contacts: z.object({
    phone: z.string(),
    email: z.string().email({ message: "Indirizzo email non valido" }),
  }),
});

export type FormValues = z.infer<typeof ProfileSchema>;
