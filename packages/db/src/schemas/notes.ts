import { relations } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import z from "zod";

import { patients, therapists } from "../schema";
import { createTable } from "../table";

/**
 * Notes table schema and its relations.
 */
export const notes = createTable(
  "notes",
  (d) => ({
    id: d.uuid().primaryKey().notNull().defaultRandom(),
    date: d.date("date", { mode: "date" }).notNull().defaultNow(),
    pinned: d.boolean("pinned").notNull().default(false),
    title: d.text("title").notNull(),
    content: d.text("content").notNull(),
    therapistId: d
      .uuid("therapist_id")
      .notNull()
      .references(() => therapists.id),
    patientId: d
      .uuid("patient_id")
      .notNull()
      .references(() => patients.id),
  }),
  (t) => [index("note_id").on(t.id)],
).enableRLS();

export const notesRelations = relations(notes, ({ one }) => ({
  therapist: one(therapists, {
    fields: [notes.therapistId],
    references: [therapists.id],
  }),
  patient: one(patients, {
    fields: [notes.patientId],
    references: [patients.id],
  }),
}));

export const NotesFindManySchema = z.object({
  where: z.object({
    patientId: z.string().uuid().optional(),
  }),
});

export const NoteFindUniqueSchema = z.object({
  where: z.object({
    id: z.string().uuid().optional(),
  }),
});

export const NoteCreateSchema = z.object({
  pinned: z.boolean().optional(),
  title: z.string().min(1),
  content: z.string().min(1),

  patientId: z.string().uuid(),
});
export type NoteCreate = z.infer<typeof NoteCreateSchema>;

export const NoteUpdateSchema = z.object({
  where: z.object({
    id: z.string().uuid(),
  }),
  data: NoteCreateSchema.partial(),
});
export type NoteUpdate = z.infer<typeof NoteUpdateSchema>;

export const NoteDeleteSchema = z.object({
  where: z.object({
    id: z.string().uuid(),
  }),
});
