import { modality } from '@prisma/client';
import { z } from 'zod';

export const therapistSchema = z.object({
  therapistName: z.string().min(1, { message: 'Nome è obbligatorio' }),
  therapistlastName: z.string().min(1, { message: 'Cognome è obbligatorio' }),
  modality: z.nativeEnum(modality),
  createdAt: z.string(),
});

export type TherapistData = z.infer<typeof therapistSchema>;

export function extendWithTherapistData<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) {
  return schema.extend(therapistSchema.shape);
}
