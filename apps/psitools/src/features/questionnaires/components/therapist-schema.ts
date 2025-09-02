import { z } from 'zod';
import { $Enums } from '@arianne/db/enums';

export const therapistSchema = z.object({
  therapistName: z.string().min(1, { message: 'Nome è obbligatorio' }),
  therapistLastname: z.string().min(1, { message: 'Cognome è obbligatorio' }),
  modality: z.nativeEnum($Enums.AssignmentModality),
  createdAt: z.string(),
});

export type TherapistData = z.infer<typeof therapistSchema>;

export function extendWithTherapistData<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) {
  return schema.extend(therapistSchema.shape);
}
