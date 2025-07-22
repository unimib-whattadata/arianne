import { z } from 'zod';

export const formSchema = z.object({
  response: z.object({
    items: z.record(
      z.string(),
      z.object({
        value: z
          .string({
            required_error:
              'Attenzione! Devi selezionare una risposta per poter caricare la somministrazione',
          })
          .min(1, {
            message:
              'Attenzione! Devi selezionare una risposta per poter caricare la somministrazione',
          }),
        note: z.string(),
      }),
    ),
    post: z.object({
      'post-question-1': z.string(),
      'post-question-2': z.string(),
      'post-question-symptom': z.string().optional(),
    }),
  }),
});

export type FormValues = z.infer<typeof formSchema>;
