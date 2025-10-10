import {
  boolean,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import z from "zod";

import { therapists } from "./therapists";

export const onboardingTherapist = pgTable(
  "onboarding_therapist",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    therapistId: uuid("patient_id").references(() => therapists.profileId),
    name: varchar("name", { length: 100 }).notNull(),
    surname: varchar("surname", { length: 100 }).notNull(),
    email: varchar("email", { length: 150 }).notNull(),
    subscriptionNumber: varchar("subscription_number", {
      length: 50,
    }).notNull(),

    therapeuticOrientation: varchar("therapeutic_orientation", {
      length: 150,
    }).notNull(),
    specialization: varchar("specialization", { length: 150 }).notNull(),
    experienceYears: varchar("experience_years", { length: 10 }).notNull(),

    location: varchar("location", { length: 150 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    province: varchar("province", { length: 100 }).notNull(),
    cap: varchar("cap", { length: 20 }).notNull(),

    acceptanceConditions: boolean("acceptance_conditions")
      .default(false)
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("onboarding_email_idx").on(table.email),
  }),
).enableRLS();

export const TherapistOnboardingCreateSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  email: z.string().email(),
  subscriptionNumber: z.string().min(1),
  therapeuticOrientation: z.string().min(1),
  specialization: z.string().min(1),
  experienceYears: z.string().min(1),
  location: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
  province: z.string().min(1),
  cap: z.string().min(1),
  acceptanceConditions: z.boolean(),
});

export type TherapistOnboardingCreateSchemaType = z.infer<
  typeof TherapistOnboardingCreateSchema
>;
