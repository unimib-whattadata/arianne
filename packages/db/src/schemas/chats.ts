import { relations } from "drizzle-orm";
import { index, pgEnum } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";
import z from "zod";

import { patients, therapists } from "../schema";
import { createTable } from "../table";

/**
 * Chats Schema and its relations.
 */

export const chats = createTable(
  "chats",
  (d) => ({
    id: d.uuid().primaryKey().notNull().defaultRandom(),
    lastIndex: d.integer("last_index").notNull(),
    createdAt: d.date("created_at").notNull().defaultNow(),
    updatedAt: d.date("updated_at").notNull().defaultNow(),

    patientProfileId: d
      .uuid("patient_profile_id")
      .notNull()
      .references(() => patients.profileId),
    therapistProfileId: d
      .uuid("therapist_profile_id")
      .notNull()
      .references(() => therapists.profileId),
  }),
  (t) => [index("chat_id").on(t.id)],
).enableRLS();

export const chatsRelations = relations(chats, ({ one, many }) => ({
  patient: one(patients, {
    fields: [chats.patientProfileId],
    references: [patients.id],
  }),
  therapist: one(therapists, {
    fields: [chats.therapistProfileId],
    references: [therapists.id],
  }),
  messages: many(messages),
}));

export const messageSenderTypeEnum = pgEnum("message_sender_type_enum", [
  "therapist",
  "patient",
]);

export const messages = createTable(
  "messages",
  (d) => ({
    id: d.uuid().primaryKey().notNull().defaultRandom(),
    content: d.text("content").notNull(),
    senderType: messageSenderTypeEnum().notNull(),
    index: d.integer("index").notNull(),
    initials: d.text("initials").notNull(),
    createdAt: d.date("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: d.date("updated_at", { mode: "date" }).notNull().defaultNow(),

    senderId: d
      .uuid("sender")
      .notNull()
      .references(() => authUsers.id),
    chatId: d
      .uuid("chat_id")
      .notNull()
      .references(() => chats.id),
  }),
  (t) => [index("message_id").on(t.id)],
).enableRLS();

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(authUsers, {
    fields: [messages.senderId],
    references: [authUsers.id],
  }),
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

export const ChatsGetOrCreateSchema = z.object({
  patientProfileId: z.string(),
  therapistProfileId: z.string(),
});

export const ChatsAddMessageSchema = z
  .object({
    content: z.string(),
    senderType: z.enum(["patient", "therapist"]),
  })
  .merge(ChatsGetOrCreateSchema);
