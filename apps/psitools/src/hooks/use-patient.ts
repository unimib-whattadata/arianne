'use client';
import '@arianne/db/types';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { useTRPC } from '@/trpc/react';

export const usePatient = ({ id }: { id?: string } = {}) => {
  const { userId } = useParams<{ userId: string }>();
  const api = useTRPC();

  const { data, ...rest } = useQuery(
    api.patients.findUnique.queryOptions(
      {
        where: id ? { id } : { id: userId },
      },
      {
        enabled: !!userId || !!id,
      },
    ),
  );

  return { patient: data, ...rest };
};
