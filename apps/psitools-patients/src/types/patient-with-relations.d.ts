import type { MedicalRecord, Patient, Tag, User } from '@prisma/client';

export type PatientWithRelations = Patient & {
  user: User | null;
  tags: Tag[] | null;
  medicalRecord: MedicalRecord | null;
};
