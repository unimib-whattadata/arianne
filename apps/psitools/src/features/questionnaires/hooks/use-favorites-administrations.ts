import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

export const useFavoritesAdministrations = () => {
  const { patient, isLoading: isPatientLoading } = usePatient();

  const api = useTRPC();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery(
    api.preferences.getFavoritesAdministrations.queryOptions(
      {
        patientId: patient?.id,
      },
      {
        enabled: !!patient && !isPatientLoading,
        select: (data) => data?.types,
      },
    ),
  );

  const setFavoritesMutation = useMutation(
    api.preferences.setFavoritesAdministrations.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(
          api.preferences.getFavoritesAdministrations.queryFilter(),
        );
      },
    }),
  );

  const setFavorites = (favorites: string[]) => {
    setFavoritesMutation.mutate({
      patientId: patient!.id,
      types: favorites,
    });
  };

  return { favorites, isLoading, setFavorites };
};
