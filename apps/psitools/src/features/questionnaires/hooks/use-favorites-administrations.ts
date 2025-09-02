import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

export const useFavoritesAdministrations = () => {
  const { patient, isLoading: isPatientLoading } = usePatient();

  const api = useTRPC();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery(
    api.preferences.getByPatientId.queryOptions(
      { patientId: patient!.id },
      {
        enabled: !!patient && !isPatientLoading,
        select: (data) => data?.favoriteAdministrations,
      },
    ),
  );

  const setFavoritesMutation = useMutation(
    api.preferences.set.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(api.preferences.get.queryFilter());
      },
    }),
  );

  const setFavorites = (favorites: string[]) => {
    setFavoritesMutation.mutate({
      type: 'patient',
      patientId: patient.id,
      values: {
        favoriteAdministrations: favorites,
      },
    });
  };

  return { favorites, isLoading, setFavorites };
};
