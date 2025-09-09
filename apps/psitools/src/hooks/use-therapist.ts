import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/react';

export const useTherapist = () => {
  const api = useTRPC();
  const { data: user, ...rest } = useQuery(
    api.therapists.findUnique.queryOptions(),
  );

  return { user, profile: user?.profile, ...rest };
};
