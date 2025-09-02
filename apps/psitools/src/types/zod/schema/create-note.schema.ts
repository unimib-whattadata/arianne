import { z } from 'zod';

export const createNoteSchema = z.object({
  // date: z.date(),
  pinned: z.boolean().default(false),
  title: z.string().min(1, { message: 'Inserisci il titolo della nota' }),
  content: z.string().min(1, { message: 'Inserisci il contenuto della nota' }),
});

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;
