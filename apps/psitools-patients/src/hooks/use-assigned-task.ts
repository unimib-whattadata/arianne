'use client';

import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/react';

export function useAssignedTask() {
  const api = useTRPC();
  const { data, ...rest } = useQuery(api.assignments.get.queryOptions());

  return {
    tasks: data,
    tasksNums: data?.length ?? 0,
    ...rest,
  };
}
