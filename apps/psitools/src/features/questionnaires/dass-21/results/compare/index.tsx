'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { Shimmer } from '@/components/ui/schimmer';
import { useColumnsCompare } from '@/features/questionnaires/components/table/columns';
import { AdministrationResultsTable } from '@/features/questionnaires/components/table/table';
import type { FormValues } from '@/features/questionnaires/dass-21/item';
import { useTRPC } from '@/trpc/react';

import { DetailsCard } from './details-card';
import { ScoreCard } from './score-card';

export default function AdministrationResultsPswq16Page() {
  const searchParams = useSearchParams();
  const comparison = searchParams.getAll('comparison');
  const [tA, tB] = (comparison as [string, string]) ?? [];
  const columnsCompare = useColumnsCompare();

  const api = useTRPC();

  const { data, isLoading } = useQuery(
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
      },
    ),
  );

  if (!data || isLoading) return <Shimmer className="h-full w-full" />;

  const [prevAdministration, nextAdministration] = data;

  if (!prevAdministration || !nextAdministration)
    return (
      <p>
        Errore nel ritrovamento delle informazioni relative alle
        somministrazioni.
      </p>
    );

  const prevRecords = prevAdministration?.records as FormValues;
  const nextRecords = nextAdministration?.records as FormValues;

  const prevResponse = prevRecords.response;
  const nextResponse = nextRecords.response;

  const prevScore = prevRecords.score;
  const nextScore = nextRecords.score;

  const prevT = prevAdministration.T ?? 0;
  const nextT = nextAdministration.T ?? 0;

  if (
    prevResponse === undefined ||
    prevScore === undefined ||
    nextResponse === undefined ||
    nextScore === undefined
  )
    return null;

  return (
    <div className="flex flex-col gap-8">
      {isLoading ? (
        <Shimmer className="h-full w-full" />
      ) : (
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="font-h2 pb-4">
              Depression Anxiety Stress Scales 21 (DASS-21)
            </h2>
            <div className="flex w-[50rem] flex-col">
              <AdministrationResultsTable
                columns={columnsCompare}
                data={[prevAdministration, nextAdministration]}
                questionnaire="cba-ve"
              />
            </div>
          </section>

          <section className="space-y-8">
            <ScoreCard
              prevScore={prevScore}
              nextScore={nextScore}
              prevT={prevT}
              nextT={nextT}
            />

            <DetailsCard
              prevResponse={prevResponse}
              nextResponse={nextResponse}
              prevT={prevT}
              nextT={nextT}
            />
          </section>
        </div>
      )}
    </div>
  );
}
