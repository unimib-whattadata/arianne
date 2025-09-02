import { relations } from "drizzle-orm";
import { index, pgEnum } from "drizzle-orm/pg-core";
import z from "zod";

import { medicalRecords, patients } from "../schema";
import { createTable } from "../table";

export const diariesTypeEnum = pgEnum("diary_type", [
  "sleep_morning",
  "sleep_evening",
  "cognitive_behavioral",
  "food",
]);

/**
 * Diaries Schema and its relations.
 */
export const diaries = createTable(
  "diaries",
  (d) => ({
    id: d.uuid().primaryKey().notNull().defaultRandom(),
    date: d.date("date").notNull(),
    type: diariesTypeEnum(),
    content: d.text("content").notNull(),
    updatedAt: d.timestamp("updated_at").notNull().defaultNow(),
    state: d.boolean("state").default(false),

    medicalRecordId: d
      .uuid("medical_record_id")
      .references(() => medicalRecords.id),
    patientId: d.uuid("patient_id").references(() => patients.id),
  }),
  (t) => [index("diary_id").on(t.id)],
).enableRLS();

export const diariesRelations = relations(diaries, ({ one }) => ({
  medicalRecord: one(medicalRecords, {
    fields: [diaries.medicalRecordId],
    references: [medicalRecords.id],
  }),
  patient: one(patients, {
    fields: [diaries.patientId],
    references: [patients.id],
  }),
}));

export const DiariesFindSchema = z.object({
  type: z.enum(diariesTypeEnum.enumValues),
  date: z.date().optional(),
  patientId: z.string().optional(),
  id: z.string().optional(),
});

export const DiariesGetAllSchema = z.object({
  type: z.enum(diariesTypeEnum.enumValues),
  patientId: z.string().optional(),
});

export const DiariesCreateSchema = z.object({
  type: z.enum(diariesTypeEnum.enumValues),
  patientId: z.string().optional(),
  content: z.record(z.string(), z.unknown()),
});

export const DiariesUpdateSchema = z.object({
  id: z.string(),
  content: z.record(z.string(), z.any()),
  state: z.boolean().optional(),
});

export const DiariesFindByIdSchema = z.object({
  id: z.string(),
});
