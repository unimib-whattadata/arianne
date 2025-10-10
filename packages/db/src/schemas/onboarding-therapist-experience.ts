import { relations } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { z } from "zod";

import { createTable } from "../table";
import { therapists } from "./therapists";

export const onboardingTherapistExperience = createTable(
  "onboarding_therapist_experience",
  (f) => ({
    id: f.uuid().primaryKey().defaultRandom().notNull(),

    therapistId: f.uuid("therapist_id").references(() => therapists.profileId),

    workMode: f.varchar("work_mode", { length: 150 }).notNull(),
    experienceYears: f.integer("experience_years").notNull(),
    description: f.text("description").notNull(),
    therapeuticOrientation: f
      .varchar("therapeutic_orientation", { length: 255 })
      .notNull(),
    languages: f.varchar("languages", { length: 255 }).notNull(),
    clinicalSpecialization: f
      .varchar("clinical_specialization", { length: 255 })
      .notNull(),
    skills: f.varchar("skills", { length: 255 }).notNull(),
    categories: f.text("categories").array().notNull(),
    ageRanges: f.text("age_ranges").array().notNull(),
    address: f.varchar("address", { length: 255 }),
    country: f.varchar("country", { length: 100 }),
    province: f.varchar("province", { length: 100 }),

    updatedAt: f.timestamp("updated_at").defaultNow().notNull(),
  }),
  (t) => [index("onboarding_therapist_experience_id_idx").on(t.id)],
).enableRLS();

export const onboardingTherapistExperienceRelations = relations(
  onboardingTherapistExperience,
  ({ one }) => ({
    therapist: one(therapists, {
      fields: [onboardingTherapistExperience.therapistId],
      references: [therapists.profileId],
    }),
  }),
);

export const OnboardingTherapistExperienceSchema = z.object({
  workMode: z.string().min(1),
  experienceYears: z.coerce.number().min(0),
  description: z.string().min(1),
  therapeuticOrientation: z.string().min(1),
  languages: z.string().min(1),
  clinicalSpecialization: z.string().min(1),
  skills: z.string().min(1),
  categories: z.array(z.string()).min(1),
  ageRanges: z.array(z.string()).min(1),
  address: z.string().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
});
