import { z } from 'zod';

import { trpc } from '@/trpc/api';

export const accountSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Inserisci l'username del paziente" })
    .regex(/^\S*$/, {
      message: "L'username non può contenere spazi",
    })
    .refine(
      async (username) => {
        const isAvailable = await trpc.user.checkAvailability.query({
          where: { username },
        });
        return isAvailable;
      },
      {
        message: 'Esiste già un utente con questo username',
      },
    ),
  email: z
    .string()
    .email({ message: 'Inserisci un indirizzo email valido' })
    .min(1, { message: "Inserisci l'email del paziente" })
    .refine(
      async (email) => {
        const isAvailable = await trpc.user.checkAvailability.query({
          where: { email },
        });
        return isAvailable;
      },
      {
        message: 'Esiste già un utente con questa email',
      },
    ),
  // password: z.string().min(6, { message: 'La password è troppo corta' }),
  // confirmPassword: z.string().min(6, { message: 'Conferma la password' }),
  phone: z
    .string()
    .min(1, { message: 'Inserisci il numero di telefono del paziente' })
    .regex(/^(\+39|0039)?\d{8,10}$/, {
      message: 'Il numero di telefono non è valido',
    }),
  address: z
    .string()
    .min(1, { message: "Inserisci l'indirizzo di residenza del paziente" }),
});

export type AccountSchema = z.infer<typeof accountSchema>;

export const anamnesisSchema = z.object({
  name: z.string().min(1, { message: 'Inserisci il nome del paziente' }),
  sex: z.enum(['M', 'F'], {
    required_error: 'Inserisci il sesso del paziente',
  }),
  pronoun: z.string(),
  age: z
    .number({
      required_error: "Inserisci l'età del paziente",
      invalid_type_error: "L'età deve essere un numero",
    })
    .int(),
  schooling: z
    .string()
    .min(1, { message: 'Inserisci il grado di scolarità del paziente' }),
  birthPlace: z
    .string()
    .min(1, { message: 'Inserisci il luogo di nascita del paziente' }),
  previousInterventions: z
    .string()
    .transform((value) =>
      value.length < 1 ? 'Nessun intervento pregresso' : value,
    ),
  reason: z
    .string()
    .min(1, { message: 'Inserisci il  motivo della presa in carico' }),
});

export type AnamnesisSchema = z.infer<typeof anamnesisSchema>;

export const clinicalDataSchema = z.object({
  diagnosticHypothesis: z
    .string()
    .min(1, { message: "Inserisci l'ipotesi diagnostica" }),
  simptoms: z
    .string()
    .min(1, { message: 'Inserisci la sintomatologia del paziente' }),
});

export type ClinicalDataSchema = z.infer<typeof clinicalDataSchema>;

export const interventionSchema = z.object({
  goals: z.string().min(1, { message: 'Inserisci gli obiettivi' }),
  therapeuticPlan: z
    .string()
    .min(1, { message: 'Inserisci il piano terapeutico per il paziente' }),
  frequency: z.string().min(1, {
    message: 'Inserisci la frequenta degli incontri con il paziente',
  }),
  takingChargeDate: z.coerce.date({
    invalid_type_error: 'Inserisci una data valida',
    required_error: 'Inserisci la data di presa in carico',
  }),
});

export type InterventionSchema = z.infer<typeof interventionSchema>;

export const createPatientSchema = accountSchema
  .merge(anamnesisSchema)
  .merge(clinicalDataSchema)
  .merge(interventionSchema);

export type CreatePatientSchema = z.infer<typeof createPatientSchema>;
