'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { Shimmer } from '@/components/ui/schimmer';
import { AdministrationCardDetail } from '@/features/questionnaires/components/administration-card-detail';
import type { FormValues } from '@/features/questionnaires/dass-21/item';
import { useTRPC } from '@/trpc/react';
import type { TView } from '@/types/view-types';
import { dateFormatting } from '@/utils/date-formatter';

import { DetailsCard } from './details-card';
import { ScoreCard } from './score-card';

export default function AdministrationResultsIusRPage() {
  const { view } = useParams<{ view: TView }>();
  const [_, administration] = view;

  const api = useTRPC();

  const { data: currentAdministration, isLoading } = useQuery(
    api.administration.findUnique.queryOptions(
      {
        where: {
          id: administration,
        },
      },
      {
        enabled: !!administration,
      },
    ),
  );

  if (!currentAdministration || isLoading)
    return <Shimmer className="h-full w-full" />;

  const records = currentAdministration.administration.records as FormValues;

  const response = records.response;
  const score = records.score;
  const T = currentAdministration.administration.T ?? 0;

  if (response === undefined || score === undefined) return null;

  return (
    <div className="flex flex-col gap-8">
      {isLoading ? (
        <Shimmer className="h-full w-full" />
      ) : (
        <AdministrationCardDetail
          testType={
            currentAdministration.administration.type ?? 'Dato non trovato'
          }
          testNumber={`T${currentAdministration.administration.T ?? ''}`}
          date={dateFormatting(
            currentAdministration.administration.date ?? new Date(),
            'dd/MM/yyyy',
          )}
        />
      )}

      <ScoreCard score={score} />

      <DetailsCard response={response} T={T} />
    </div>
  );
}
