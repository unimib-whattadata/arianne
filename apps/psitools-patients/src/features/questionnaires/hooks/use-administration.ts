'use client';

import type { $Enums } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';

import { useTRPC } from '@/trpc/react';
import type { TView } from '@/types/view-types';

interface TAdministration<FormValues> {
  T: number;
  records: FormValues;
  id: string;
  patientId: string;
  date: Date;
  type: string;
  medicalRecordId: string;
}

interface TAdministrationReturn<FormValues> {
  isLoading: boolean;
  sex?: $Enums.Sex;
  administration:
    | TAdministration<FormValues>[]
    | TAdministration<FormValues>
    | undefined;
}
/**
 * Custom hook to fetch administration data.
 *
 * @param {Object} props - `{isComparison?: boolean}` Whether the administration data is for comparison or not.
 * @returns An object containing the loading state and the administration data. Administration data is a tuple of two administrations if the `isComparison` prop is `true`, otherwise it's a single administration.
 */
export function useAdministration<FormValues>(props: {
  isComparison?: true;
  hasSex?: false;
}): {
  isLoading: boolean;
  administration: TAdministration<FormValues>[] | undefined;
};

export function useAdministration<FormValues>(props?: {
  isComparison?: false;
  hasSex?: false;
}): {
  isLoading: boolean;
  administration: TAdministration<FormValues> | undefined;
};

export function useAdministration<FormValues>(props?: {
  hasSex?: false;
  isComparison?: false;
}): {
  isLoading: boolean;
  administration: TAdministration<FormValues>[] | undefined;
};

export function useAdministration<FormValues>(props?: {
  hasSex?: true;
  isComparison?: true;
}): {
  isLoading: boolean;
  sex: $Enums.Sex;
  administration: TAdministration<FormValues>[] | undefined;
};

export function useAdministration<FormValues>(props?: {
  hasSex?: true;
  isComparison?: false;
}): {
  isLoading: boolean;
  sex: $Enums.Sex;
  administration: TAdministration<FormValues> | undefined;
};

export function useAdministration<FormValues>(props?: {
  isComparison?: boolean;
  hasSex?: boolean;
}): TAdministrationReturn<FormValues> {
  const { isComparison = false, hasSex = false } = props ?? {};
  const { view } = useParams<{ view: TView }>();
  const searchParams = useSearchParams();
  const comparison = searchParams.getAll('comparison');
  const [_, id] = view;
  const [tA, tB] = comparison ?? [];

  const api = useTRPC();

  const { data: singleData, isLoading: singleIsLoading } = useQuery(
    api.administration.findUnique.queryOptions(
      {
        where: {
          id,
        },
      },
      {
        enabled: !!id && !isComparison,
        select: (data) => {
          return {
            ...data.administration,
            T: data.administration.T!,
            records: data.administration.records as FormValues,
          };
        },
      },
    ),
  );

  const { data: comparisonData, isLoading: comparisonIsLoading } = useQuery(
    api.administration.findMany.queryOptions(
      {
        where: {
          OR: [{ id: tA }, { id: tB }],
        },
        orderBy: {
          T: 'asc',
        },
      },
      {
        enabled: !!comparison || !!tA || !!tB,
        select: (data) => {
          return data.map((item) => ({
            ...item,
            T: item.T!,
            records: item.records as FormValues,
          }));
        },
      },
    ),
  );

  const { data: sex } = useQuery(
    api.medicalRecord.findUnique.queryOptions(
      {
        where: {
          id:
            singleData?.medicalRecordId || comparisonData?.[0]?.medicalRecordId,
        },
        select: {
          sex: true,
        },
      },
      {
        enabled: (!!comparisonData || !!singleData) && hasSex,
        select: (data) => data?.sex ?? undefined,
      },
    ),
  );

  const isLoading = isComparison ? comparisonIsLoading : singleIsLoading;

  if (isComparison) {
    return { isLoading, administration: comparisonData, sex };
  }

  return { isLoading, administration: singleData, sex };
}
