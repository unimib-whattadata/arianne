import { z } from 'zod';

export const createNoteSchema = z.object({
  pinned: z.boolean().default(false),
  title: z.string().min(1, { message: 'Inserisci il titolo della nota' }),
  content: z.string().min(1, { message: 'Inserisci il contenuto della nota' }),
});

export type CreateNoteType = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = createNoteSchema.partial();
export type UpdateNoteType = z.infer<typeof updateNoteSchema>;
