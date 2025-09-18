import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/react';

export const useTherapist = (id: string) => {
  const api = useTRPC();
  const { data: user, ...rest } = useQuery(
    api.therapists.get.queryOptions({ id }),
  );

  return { user, profile: user?.profile, ...rest };
};
