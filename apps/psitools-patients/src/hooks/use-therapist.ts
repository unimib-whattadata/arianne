import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/react';

export const useTherapist = (therapistId: string) => {
  const api = useTRPC();
  const { data: user, ...rest } = useQuery(
    api.therapist.therapistById.queryOptions({
      therapistId: therapistId,
    }),
  );

  return { user, userInfo: user?.user, ...rest };
};
