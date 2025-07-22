import { z } from 'zod';

export const FormSchema = z.object({
  bheavior: z.string().optional(),
  bodyFeeling: z.string().optional(),
  company: z.string().optional(),
  companyPerson: z.string().optional(),
  context: z.string().optional(),
  description: z.string().optional(),
  emotion: z.string().optional(),
  intensity: z.number().optional(),
  momentDay: z.string().optional(),
  place: z.string().optional(),
  thought: z.string().optional(),
  unpleasant: z.string().optional(),
  note: z.string().optional(),
  bodyEmotion: z.string().optional(),
});

export const defaultValues = {
  bheavior: '',
  bodyFeeling: '',
  bodyEmotion: '',
  company: '',
  companyPerson: '',
  context: '',
  description: '',
  emotion: '',
  intensity: 0,
  momentDay: ' ',
  place: '',
  thought: '',
  unpleasant: '',
  note: '',
};

export type FormData = z.infer<typeof FormSchema>;
