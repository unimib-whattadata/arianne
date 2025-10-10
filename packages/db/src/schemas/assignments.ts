import { relations } from "drizzle-orm";
import { index, pgEnum } from "drizzle-orm/pg-core";
import z from "zod";

import { patients, therapists } from "../schema";
import { createTable } from "../table";
import { mapEnumValues } from "../utils";

/**
 * Assignments table schema and its relations.
 */
export const assignmentTypeEnum = pgEnum("assignment_type", [
  "diary",
  "administration",
  "drugs",
]);

export const assignmentRecurrenceEnum = pgEnum("assignment_recurrence", [
  "none",
  "daily",
  "weekly",
  "monthly",
]);
export const assignmentStateEnum = pgEnum("assignment_state", [
  "assigned",
  "in_progress",
  "completed",
]);

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const weekdayEnum = pgEnum("weekday", [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export const assignmentEnums = {
  AssignmentType: mapEnumValues(assignmentTypeEnum.enumValues),
  AssignmentRecurrence: mapEnumValues(assignmentRecurrenceEnum.enumValues),
  AssignmentState: mapEnumValues(assignmentStateEnum.enumValues),
};

export const assignments = createTable(
  "assignments",
  (d) => ({
    id: d.uuid().primaryKey().notNull().defaultRandom(),
    type: assignmentTypeEnum().notNull(),
    name: d.text("name").notNull(),
    recurrence: assignmentRecurrenceEnum().notNull().default("none"),
    date: d.date("date", { mode: "date" }).notNull(),
    recurrenceConfig: d.json().$type<{
      weekdays?: Weekday[];
      dayOfMonth?: number[];
    }>(),
    state: assignmentStateEnum().default("assigned").notNull(),
    createdAt: d.timestamp("created_at").defaultNow(),
    updatedAt: d.timestamp("updated_at").defaultNow(),

    patientId: d
      .uuid("patient_id")
      .references(() => patients.id)
      .notNull(),
    therapistId: d
      .uuid("therapist_id")
      .references(() => therapists.id)
      .notNull(),
  }),
  (t) => [index("assignment_id").on(t.id)],
).enableRLS();

export const assignmentsRelations = relations(assignments, ({ one }) => ({
  patient: one(patients, {
    fields: [assignments.patientId],
    references: [patients.id],
  }),
  therapist: one(therapists, {
    fields: [assignments.therapistId],
    references: [therapists.id],
  }),
}));

const Weekday = z.enum(weekdayEnum.enumValues);

export const NoneRecurrenceSchema = z.object({
  name: z.string().min(1, {
    message: "L'assegnazione è obbligatoria",
  }),
  type: z.enum(assignmentTypeEnum.enumValues),
  date: z.date(),
  recurrence: z.literal(assignmentRecurrenceEnum.enumValues[0]), // "none"
  recurrenceConfig: z.object({
    weekdays: z.array(Weekday),
    dayOfMonth: z.array(z.number().int().min(1).max(31)),
  }),
  patientId: z.string(),
});
export type NoneRecurrence = z.infer<typeof NoneRecurrenceSchema>;

export const DailyRecurrenceSchema = z.object({
  name: z.string().min(1, {
    message: "L'assegnazione è obbligatoria",
  }),
  type: z.enum(assignmentTypeEnum.enumValues),
  date: z.date(),
  recurrence: z.literal(assignmentRecurrenceEnum.enumValues[1]), // "daily"
  recurrenceConfig: z.object({
    weekdays: z.array(Weekday),
    dayOfMonth: z.array(z.number().int().min(1).max(31)),
  }),
  patientId: z.string(),
});
export type DailyRecurrence = z.infer<typeof DailyRecurrenceSchema>;

export const WeeklyRecurrenceSchema = z.object({
  name: z.string().min(1, {
    message: "L'assegnazione è obbligatoria",
  }),
  type: z.enum(assignmentTypeEnum.enumValues),
  date: z.date(),
  recurrence: z.literal(assignmentRecurrenceEnum.enumValues[2]), // "weekly"
  recurrenceConfig: z.object({
    weekdays: z.array(Weekday).min(1, {
      message: "Deve essere presente almeno un giorno della settimana",
    }),
  }),
  patientId: z.string(),
});
export type WeeklyRecurrence = z.infer<typeof WeeklyRecurrenceSchema>;

export const MonthlyRecurrenceSchema = z.object({
  name: z.string().min(1, {
    message: "L'assegnazione è obbligatoria",
  }),
  type: z.enum(assignmentTypeEnum.enumValues),
  date: z.date(),
  recurrence: z.literal(assignmentRecurrenceEnum.enumValues[3]), // "monthly"
  recurrenceConfig: z.object({
    dayOfMonth: z.array(z.number().int().min(1).max(31)).min(1, {
      message: "Deve essere presente almeno un giorno del mese",
    }),
  }),
  patientId: z.string(),
});
export type MonthlyRecurrence = z.infer<typeof MonthlyRecurrenceSchema>;

export const assignmentSchema = z.discriminatedUnion("recurrence", [
  NoneRecurrenceSchema,
  DailyRecurrenceSchema,
  WeeklyRecurrenceSchema,
  MonthlyRecurrenceSchema,
]);

export const formAssignmentSchema = z.discriminatedUnion("recurrence", [
  NoneRecurrenceSchema.omit({ patientId: true }),
  DailyRecurrenceSchema.omit({ patientId: true }),
  WeeklyRecurrenceSchema.omit({ patientId: true }),
  MonthlyRecurrenceSchema.omit({ patientId: true }),
]);

export const UpdateSchema = z.object({
  data: assignmentSchema,
  where: z.object({
    id: z.string(),
  }),
});

export const AssignmentsCreateSchema = assignmentSchema;

export const AssignmentsUpdateSchema = z.object({
  where: z.object({
    id: z.string(),
  }),
  data: assignmentSchema,
});

export const AssignmentsFindUniqueSchema = z
  .object({
    where: z.object({
      id: z.string().optional(),
    }),
  })
  .optional();

export const AssignmentsDeleteSchema = z.object({
  where: z.object({
    id: z.string(),
  }),
});
