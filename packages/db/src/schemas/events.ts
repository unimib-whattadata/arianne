import { relations } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import z from "zod";

import { patients, therapists } from "../schema";
import { createTable } from "../table";

/**
 * Events Schema and its relations.
 */
export const events = createTable(
  "events",
  (d) => ({
    id: d.uuid().primaryKey().notNull().defaultRandom(),
    name: d.text("name").notNull(),
    labelColor: d.text("label_color").notNull(),
    date: d.date("date", { mode: "date" }).notNull(),
    endDate: d.date("end_date", { mode: "date" }),
    meetingLink: d.text("meeting_link"),
    location: d.text("location"),
    description: d.text("description"),
    startTime: d.text("start_time"),
    endTime: d.text("end_time"),
    notification: d.text("notification"),
    isAllDay: d.boolean("is_all_day").notNull().default(false),
    recurring: d.text("recurring"),
    otherParticipants: d
      .text("other_participants")
      .array()
      .notNull()
      .default([]),

    therapistId: d
      .uuid("therapist_id")
      .notNull()
      .references(() => therapists.id),
  }),
  (t) => [index("event_id").on(t.id)],
).enableRLS();

export const eventsRelations = relations(events, ({ one, many }) => ({
  participants: many(participants),
  therapist: one(therapists, {
    fields: [events.therapistId],
    references: [therapists.id],
  }),
}));

export const EventsCreateSchema = z.object({
  name: z.string().min(1).max(100),
  labelColor: z.string(),
  date: z.date(),
  endDate: z.date().nullable(),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
  isAllDay: z.boolean(),
  description: z.string().nullable(),
  location: z.string().nullable(),
  meetingLink: z.string().nullable(),
  notification: z.string().nullable(),
  recurring: z.string().nullable(),
  otherParticipants: z.string().array(),
});

export const EventsUpdateSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  labelColor: z.string().optional(),
  date: z.date().optional(),
  endDate: z.date().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isAllDay: z.boolean().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  meetingLink: z.string().optional(),
  notification: z.string().optional(),
  recurring: z.string().optional(),
  otherParticipants: z.string().array().optional(),
});

export const EventsDeleteSchema = z.object({
  id: z.string(),
});

export const EventsGetAllSchema = z
  .object({
    who: z.enum(["patient", "therapist"]),
  })
  .optional();

export const participants = createTable(
  "participants",
  (d) => ({
    id: d.uuid().primaryKey().notNull().defaultRandom(),
    eventId: d
      .uuid("event_id")
      .notNull()
      .references(() => events.id),
    patientId: d
      .uuid("patient_id")
      .notNull()
      .references(() => patients.id),
  }),
  (t) => [index("partecipant_id").on(t.id)],
).enableRLS();

export const participantsRelation = relations(participants, ({ one }) => ({
  patients: one(patients, {
    fields: [participants.patientId],
    references: [patients.id],
  }),
  events: one(events, {
    fields: [participants.eventId],
    references: [events.id],
  }),
}));
