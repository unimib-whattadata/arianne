'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { useTRPC } from '@/trpc/react';

export const usePatient = ({ id }: { id?: string } = {}) => {
  const { userId } = useParams<{ userId: string }>();
  const api = useTRPC();

  const patientId = id ?? userId;

  const { data, ...rest } = useQuery(
    api.patients.findUnique.queryOptions(
      {
        where: { id: patientId },
      },
      {
        enabled: !!patientId,
      },
    ),
  );

  return { patient: data, ...rest };
};
