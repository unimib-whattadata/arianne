import { z } from 'zod';

export const FormSchema = z.object({
  tense: z.number().optional(),
  sad: z.number().optional(),
  difficulty: z.number().optional(),
  tired: z.number().optional(),
});

export const defaultValues = {
  tense: 0,
  sad: 0,
  difficulty: 0,
  tired: 0,
};

export type FormData = z.infer<typeof FormSchema>;
