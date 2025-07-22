import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/react';

export const useTherapist = () => {
  const api = useTRPC();
  const { data: user, ...rest } = useQuery(
    api.therapist.findUnique.queryOptions(),
  );

  return { user, userInfo: user?.user, ...rest };
};
