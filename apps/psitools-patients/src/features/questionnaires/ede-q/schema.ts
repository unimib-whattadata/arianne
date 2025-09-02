import { z } from 'zod';

export const formSchema = z.object({
  response: z.object({
    items: z.record(
      z.string(),
      z
        .string({
          required_error:
            'Attenzione! Devi selezionare una risposta per poter caricare la somministrazione',
        })
        .min(1, {
          message:
            'Attenzione! Devi selezionare una risposta per poter caricare la somministrazione',
        }),
    ),
    score: z
      .object({
        R: z.number(),
        PA: z.number(),
        PFC: z.number(),
        PP: z.number(),
      })
      .optional(),
    notes: z.record(
      z.string(),
      z
        .string({
          required_error:
            'Attenzione! Devi selezionare una risposta per poter caricare la somministrazione',
        })
        .min(1, {
          message:
            'Attenzione! Devi selezionare una risposta per poter caricare la somministrazione',
        }),
    ),
  }),
});

export type FormValues = z.infer<typeof formSchema>;
