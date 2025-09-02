import { relations } from "drizzle-orm";
import { index, pgEnum } from "drizzle-orm/pg-core";
import z from "zod";

import { patients, therapists } from "../schema";
import { createTable } from "../table";

export const notificationTypeEnum = pgEnum("notification_type_enum", [
  "event_cancelled",
  "event_modified",
  "task_completed",
  "administration_completed",
  "diary_completed",
]);
/**
 * Notifications Schema and its relations.
 */
export const notifications = createTable(
  "notifications",
  (d) => ({
    id: d.uuid().primaryKey().notNull().defaultRandom(),
    type: notificationTypeEnum().notNull(),
    title: d.text("title").notNull(),
    description: d.text("description").notNull(),
    read: d.boolean("read").notNull().default(false),
    createdAt: d.date("created_at", { mode: "date" }).notNull().defaultNow(),

    patientId: d
      .uuid("patient_id")
      .notNull()
      .references(() => patients.id),
    therapistId: d
      .uuid("therapist_id")
      .notNull()
      .references(() => therapists.id),
  }),
  (t) => [index("notification_id").on(t.id)],
).enableRLS();

export const notificationsRelations = relations(notifications, ({ one }) => ({
  patient: one(patients, {
    fields: [notifications.patientId],
    references: [patients.id],
  }),
  therapist: one(therapists, {
    fields: [notifications.therapistId],
    references: [therapists.id],
  }),
}));

export const NotificationsCreateSchema = z.object({
  type: z.enum(notificationTypeEnum.enumValues),
  title: z.string().min(1),
  description: z.string().min(1),
  patientId: z.string(),
});

export const NotificationsMarkAsReadSchema = z.object({
  id: z.string(),
  currentRead: z.boolean(),
});

export const NotificationsDeleteSchema = z.object({
  id: z.string(),
});
