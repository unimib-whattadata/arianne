import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

export const useFavoritesTemplates = () => {
  const { patient, isLoading: isPatientLoading } = usePatient();

  const api = useTRPC();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery(
    api.preferencesTemplates.getFavoritesTemplates.queryOptions(
      { patientId: patient?.id },
      { enabled: !isPatientLoading, select: (data) => data?.templateIds || [] },
    ),
  );

  const setFavoritesMutation = useMutation(
    api.preferencesTemplates.setFavoritesTemplates.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(
          api.preferencesTemplates.getFavoritesTemplates.queryFilter(),
        );
      },
    }),
  );

  const setFavorites = (templateIds: string[]) => {
    setFavoritesMutation.mutate({ patientId: patient?.id, templateIds });
  };

  const toggleFavorite = (templateId: string) => {
    const currentFavorites = favorites || [];
    const isFavorite = currentFavorites.includes(templateId);

    if (isFavorite) {
      setFavorites(currentFavorites.filter((id) => id !== templateId));
    } else {
      setFavorites([...currentFavorites, templateId]);
    }
  };

  return {
    favorites: favorites || [],
    isLoading,
    setFavorites,
    toggleFavorite,
    isUpdating: setFavoritesMutation.isPending,
  };
};
