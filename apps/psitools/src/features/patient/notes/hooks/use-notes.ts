import { useQuery } from '@tanstack/react-query';

import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

export const useNotes = () => {
  const { patient, isLoading } = usePatient();
  const api = useTRPC();
  const { data: notes, isLoading: isLoadingNotes } = useQuery(
    api.notes.findMany.queryOptions(
      {
        where: { patientId: patient!.id },
      },
      { enabled: !!patient },
    ),
  );

  return {
    notes,
    isLoading: isLoading || isLoadingNotes,
    isError: !patient || !notes,
    isEmpty: notes?.length === 0,
  };
};
