import { relations } from "drizzle-orm";
import { index, pgEnum } from "drizzle-orm/pg-core";
import z from "zod";

import { patients } from "../schema";
import { createTable } from "../table";
import { mapEnumValues } from "../utils";
import { medicalRecords } from "./medical-records";

export const assignmentModalityEnum = pgEnum("assignment_modality", [
  "autonoma_presenza",
  "intervista",
  "accompagnatore",
]);

export const administrationEnums = {
  AssignmentModality: mapEnumValues(assignmentModalityEnum.enumValues),
};

/**
 * Administration table schema and its relations.
 */
export const administrations = createTable(
  "administration",
  (d) => ({
    id: d.uuid().primaryKey().notNull().defaultRandom(),
    T: d.integer("T").notNull(),
    date: d.date("date", { mode: "date" }).notNull().defaultNow(),
    type: d.text("type").notNull(),
    records: d.json().$type<Record<string, unknown>>().notNull(),
    therapistName: d.text("therapist_name").notNull(),
    therapistLastname: d.text("therapist_lastname").notNull(),
    modality: assignmentModalityEnum().notNull(),
    createdAt: d.date("created_at").notNull().defaultNow(),

    patientId: d
      .uuid("patient_id")
      .notNull()
      .references(() => patients.id),
    medicalRecordId: d
      .uuid("medical_record_id")
      .notNull()
      .references(() => medicalRecords.id),
  }),
  (t) => [index("administration_id").on(t.id)],
).enableRLS();

export const administrationsRelations = relations(
  administrations,
  ({ one }) => ({
    patient: one(patients, {
      fields: [administrations.patientId],
      references: [patients.id],
    }),
    medicalRecord: one(medicalRecords, {
      fields: [administrations.medicalRecordId],
      references: [medicalRecords.id],
    }),
  }),
);

export const AdministrationsFindUniqueSchema = z.object({
  id: z.string().uuid(),
});

export const AdministrationsFindManySchema = z.object({
  where: z.object({
    id: z
      .object({
        a: z.string().uuid(),
        b: z.string().uuid(),
      })
      .optional(),
    patientId: z.string().uuid().optional(),
    type: z.string().optional(),
  }),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().min(0).optional(),
  orderBy: z
    .object({
      T: z.enum(["asc", "desc"]),
    })
    .optional(),
});

export const AdministrationsCreateSchema = z.object({
  date: z.date().optional(),
  type: z.string().min(2).max(100),
  records: z.record(z.any()),
  therapistName: z.string().min(2).max(100),
  therapistLastname: z.string().min(2).max(100),
  modality: z.enum(assignmentModalityEnum.enumValues),
  createdAt: z.string().optional(),

  patientId: z.string().uuid(),
});

export const AdministrationsUpdateSchema =
  AdministrationsCreateSchema.partial().extend({
    id: z.string().uuid(),
  });

export const AdministrationsDeleteSchema = z.object({
  id: z.string().uuid(),
});
