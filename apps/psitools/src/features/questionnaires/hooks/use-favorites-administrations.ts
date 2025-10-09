import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

export const useFavoritesAdministrations = () => {
  const { patient } = usePatient();

  const api = useTRPC();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery(
    api.preferences.get.queryOptions(
      {
        key: 'favoritesAdministrations',
        patientId: patient?.id,
      },
      {
        enabled: !!patient,
        select: (data) => {
          const value = data?.value as {
            patientId: string;
            data: string[];
          } | null;
          return value?.data ?? [];
        },
      },
    ),
  );

  const setFavoritesMutation = useMutation(
    api.preferences.set.mutationOptions({
      onError: (error) => {
        console.error('Error updating favorite administrations:', error);
      },
      onSettled: async () => {
        await queryClient.invalidateQueries(api.preferences.get.queryFilter());
      },
    }),
  );

  const setFavorites = (favorites: string[]) => {
    setFavoritesMutation.mutate({
      key: 'favoritesAdministrations',
      value: {
        patientId: patient!.id,
        data: favorites,
      },
    });
  };

  return { favorites, isLoading, setFavorites };
};
