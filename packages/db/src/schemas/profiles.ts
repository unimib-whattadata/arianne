import { foreignKey } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";
import z from "zod";

import { createTable } from "../table";
import { mapEnumValues } from "../utils";

const roles = ["therapist", "patient"] as const;

export const profileEnums = {
  role: mapEnumValues(roles),
};

export const profiles = createTable(
  "profiles",
  (d) => ({
    id: d.uuid().primaryKey().notNull(),
    email: d.text().notNull(),

    firstName: d.text("first_name").notNull(),
    lastName: d.text("last_name").notNull(),
    phone: d.text(),
    address: d.text(),
    avatarUrl: d.text("avatar_url"),
    role: d.text("role").$type<(typeof roles)[number]>().notNull(),

    completedOnboarding: d
      .boolean("completed_onboarding")
      .notNull()
      .default(false),
  }),
  (table) => [
    foreignKey({
      columns: [table.id],
      // reference to the auth table from Supabase
      foreignColumns: [authUsers.id],
      name: "profiles_id_fk",
    }).onDelete("cascade"),
  ],
).enableRLS();

export const UpdateFormSchema = z.object({
  firstName: z.string().min(1, "Il nome è obbligatorio"),
  lastName: z.string().min(1, "Il cognome è obbligatorio"),
  phone: z.string().optional(),
  email: z.string().email("Email non valida"),
  dateOfBirth: z.date().refine((date) => {
    if (!date) return true;
    return date <= new Date();
  }, "La data di nascita non può essere nel futuro"),
  placeOfBirth: z.string().min(1, "Il luogo di nascita è obbligatorio"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Genere non valido" }),
  }),
  taxCode: z.string().min(1, "Il codice fiscale è obbligatorio"),
  vatNumber: z.string().min(1, "La partita IVA è obbligatoria"),
  taxRegime: z.string().optional(),
  IBANcode: z.string().min(1, "L'IBAN è obbligatorio"),
  PECemail: z.string().email("PEC non valida").optional(),
  SDIcode: z.string().optional(),
  baseRate: z.string().min(1, "La tariffa base è obbligatoria"),
  priceRange: z.string().optional(),
  maxPatients: z.number().min(1, "Deve essere almeno 1"),
  degree: z.enum(
    [
      "laurea_triennale",
      "laurea_magistrale",
      "laurea_specialistica",
      "laurea_vecchio_ordinamento",
    ],
    {
      errorMap: () => ({ message: "Titolo di studio non valido" }),
    },
  ),
  specialization: z.enum(
    [
      "clinical_psychology",
      "health_psychology",
      "child_adolescent_psychology",
      "work_organizational_psychology",
    ],
    {
      errorMap: () => ({ message: "Specializzazione non valida" }),
    },
  ),
  registrationNumber: z
    .string()
    .min(1, "Il numero di iscrizione all'albo è obbligatorio"),
  registrationProvince: z
    .string()
    .min(1, "La provincia di iscrizione all'albo è obbligatoria"),
  registrationYear: z
    .number()
    .min(1900, "Anno non valido")
    .max(new Date().getFullYear(), "Anno non valido"),
  // certifications and CV file array
  workSettings: z.enum(["in_person", "remote", "hybrid"], {
    errorMap: () => ({ message: "Impostazione lavorativa non valida" }),
  }),
  studioAddress: z.string().optional(),
  studioCity: z.string().optional(),
  studioProvince: z.string().optional(),
  yearsOfExperience: z.number().min(0, "Anni di esperienza non validi"),
  spokenLanguages: z.string().min(1, "Devi inserire almeno una lingua"),
  therapyApproaches: z.enum(
    ["cognitive", "behavioral", "humanistic", "integrative"],
    {
      errorMap: () => ({ message: "Approccio terapeutico non valido" }),
    },
  ), //da integrare con altri eventuali mancanti
  areasOfCompetence: z
    .string()
    .min(1, "Devi inserire almeno un'area di competenza"), //multiselect o scrittura manuale?
  ageRange: z
    .enum(["children", "adolescents", "adults", "elderly"], {
      message: "Fascia d'età non valida",
    })
    .optional(),

  specialCategories: z
    .enum(["LGBTQ+", "disabilities", "chronic_illness", "other"], {
      message: "Categoria specifica non valida",
    })
    .optional(),
  bio: z
    .string()
    .max(500, "La bio deve essere di massimo 500 caratteri")
    .optional(),
  avatar: z.string().url("L'URL dell'avatar non è valido"),
  weekDays: z
    .array(
      z.enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ]),
    )
    .optional(),

  timeSlots: z.array(z.enum(["morning", "afternoon", "evening"])).optional(),

  // da sistemare quando si integra l'upload dei file

  // certifications: z
  //   .array(
  //     z.instanceof(File).refine((file) => file.size <= 5_000_000, {
  //       message: "Ogni file deve essere più piccolo di 5MB",
  //     }),
  //   )
  //   .optional(),
});
