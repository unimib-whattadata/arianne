import { relations } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import z from "zod";

import { therapists } from "../schema";
import { createTable } from "../table";

/**
 * personal_forms
 * - ogni record contiene i dati personali tradotti in inglese
 * - collegamento opzionale a patients.profileId
 */

export const onboardingTherapistPersonal = createTable(
  "onboarding_therapist_personal",
  (f) => ({
    id: f.uuid().primaryKey().defaultRandom().notNull(),

    therapistId: f.uuid("therapist_id").references(() => therapists.profileId),

    name: f.varchar("first_name", { length: 100 }).notNull(),
    surname: f.varchar("last_name", { length: 100 }).notNull(),

    dateOfBirth: f.date("date_of_birth").notNull(),

    placeOfBirth: f.varchar("place_of_birth", { length: 150 }).notNull(),

    email: f.varchar("email", { length: 255 }).notNull(),
    phoneNumber: f.varchar("phone_number", { length: 50 }).notNull(),

    gender: f.varchar("gender", { length: 50 }).notNull(),

    taxCode: f.varchar("tax_code", { length: 50 }).notNull(),

    educationDegree: f.varchar("education_degree", { length: 255 }).notNull(),
    specialization: f.varchar("specialization", { length: 255 }).notNull(),

    registrationNumber: f.integer("registration_number").notNull(),

    province: f.varchar("province", { length: 100 }).notNull(),

    registrationYear: f.integer("registration_year").notNull(),

    updatedAt: f.timestamp("updated_at").defaultNow().notNull(),
  }),
  (t) => [index("personal_forms_id_idx").on(t.id)],
).enableRLS();

export const personalFormsRelations = relations(
  onboardingTherapistPersonal,
  ({ one }) => ({
    patient: one(therapists, {
      fields: [onboardingTherapistPersonal.therapistId],
      references: [therapists.profileId],
    }),
  }),
);

export const OnboardingTherapistPersonalCreateSchema = z.object({
  name: z.string(),
  surname: z.string(),
  dateOfBirth: z.string(),
  placeOfBirth: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  gender: z.string(),
  taxCode: z.string(),
  educationDegree: z.string(),
  specialization: z.string(),
  registrationNumber: z.coerce.number(),
  province: z.string(),
  registrationYear: z.coerce.number(),
});
