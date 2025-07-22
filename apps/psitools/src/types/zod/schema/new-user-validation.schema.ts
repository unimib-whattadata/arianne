import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const newUserValidationSchema = z.object({
  phone: z
    .string()
    .min(1, { message: 'Il numero di telefono è obbligatorio' })
    .regex(
      /^(\((00|\+)39\)|(00|\+)39)?(38[890]|34[7-90]|36[680]|33[3-90]|32[89])\d{7}$/gm,
      { message: 'Il numero di telefono non è valido' },
    ),
  address: z.string().min(1, { message: "L'indirizzo è obbligatorio" }),
  image: z
    .custom<File>()
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Il formato dell'immagine non è valido",
    }),
});

export type NewUserValidationSchema = z.infer<typeof newUserValidationSchema>;
