import { z } from 'zod';

export const formSchema = z.object({
  response: z.object({
    items: z
      .record(
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
      )
      .transform((data) => {
        if (data['item-34'] === 'true') {
          for (let i = 35; i <= 44; i++) {
            data[`item-${i}`] = 'N/A';
          }
          return data;
        }
        if (data['item-35'] === 'false') {
          for (let i = 36; i <= 48; i++) {
            data[`item-${i}`] = 'N/A';
          }
        }
        return data;
      })
      .refine((data) => {
        return !Object.values(data).some((value) => {
          return value === undefined;
        });
      }),
    score: z.number().optional(),
  }),
});

export type FormValues = z.infer<typeof formSchema>;
