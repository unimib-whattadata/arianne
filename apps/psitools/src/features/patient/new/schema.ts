import { z } from 'zod';

export const FormSchema = z.object({
  user: z.object({
    firstName: z
      .string()
      .min(1, { message: 'Il nome è obbligatorio' })
      .max(50, { message: 'Il nome deve essere inferiore a 50 caratteri' }),
    lastName: z
      .string()
      .min(1, { message: 'Il cognome è obbligatorio' })
      .max(50, { message: 'Il cognome deve essere inferiore a 50 caratteri' }),
    address: z.string().optional(),
    phone: z.string(),
    email: z.string().email({ message: 'Indirizzo email non valido' }),
  }),
  medicalRecords: z.object({
    alias: z.string().optional(),
    birthDate: z
      .date()
      .refine((date) => date <= new Date(), {
        message: 'La data di nascita deve essere nel passato',
      })
      .optional(),
    birthPlace: z.string().optional(),
    sex: z.enum(['M', 'F']).optional(),
    gender: z.string().optional(),
    pronoun: z.string().optional(),
    occupation: z.string().optional(),
    education: z.string().optional(),
    otherNotes: z.string().optional(),
    caregivers: z
      .array(
        z.object({
          name: z.string().min(1, { message: 'Il nome è obbligatorio' }),
          kinship: z.enum(['Madre', 'Padre', 'Fratello', 'Sorella', 'Altro'], {
            errorMap: () => ({ message: 'Parente non valido' }),
          }),
        }),
      )
      .optional(),
    tags: z
      .array(
        z.object({
          text: z.string().length(3, {
            message: 'Il tag deve essere lungo almeno 3 carattere',
          }),
        }),
      )
      .optional(),
  }),
});

export type FormValues = z.infer<typeof FormSchema>;

export const defaultValues: FormValues = {
  user: {
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    email: '',
  },
  medicalRecords: {
    alias: '',
    birthDate: undefined,
    birthPlace: '',
    sex: undefined,
    gender: '',
    pronoun: '',
    occupation: '',
    education: '',
    otherNotes: '',
    tags: [],
    caregivers: [],
  },
};
