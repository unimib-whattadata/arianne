import type { MedicalRecord, Patient, User } from '@prisma/client';

export type PatientWithRelations = Patient & {
  user: User | null;
  medicalRecord: MedicalRecord | null;
};
