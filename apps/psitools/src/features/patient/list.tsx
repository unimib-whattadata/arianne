'use client';

import { PatientsTable, useColumns } from '@/features/patient/table';
import { useTherapist } from '@/hooks/use-therapist';

export const PatientsLists = () => {
  const { user, isLoading } = useTherapist();
  const columns = useColumns();

  if (isLoading || !user) return null;

  return <PatientsTable columns={columns} data={user.patients} />;
};
