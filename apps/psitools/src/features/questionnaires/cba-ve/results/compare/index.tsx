'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import type { ReactElement } from 'react';

import { Shimmer } from '@/components/ui/schimmer';
import { AdministrationChart } from '@/features/questionnaires/cba-ve/administrationChart';
import { ScoreCard } from '@/features/questionnaires/cba-ve/score-card';
import { useColumnsCompare } from '@/features/questionnaires/components/table/columns';
import { AdministrationResultsTable } from '@/features/questionnaires/components/table/table';
import { useTRPC } from '@/trpc/react';
import type { CbaRecord } from '@/types/cba-records';

export default function AdministrationsComparisonPage() {
  const searchParams = useSearchParams();
  const api = useTRPC();
  const comparison = searchParams.getAll('comparison');

  const [t0, t1] = comparison;
  const columnsCompare = useColumnsCompare();

  const { data: administrationT0, isLoading: isLoadingT0 } = useQuery(
    api.administrations.findUnique.queryOptions({ id: t0 }),
  );

  const { data: administrationT1, isLoading: isLoadingT1 } = useQuery(
    api.administrations.findUnique.queryOptions({ id: t1 }),
  );

  if (!administrationT0 || isLoadingT0 || !administrationT1 || isLoadingT1)
    return <Shimmer className="h-full w-full" />;

  const recordsT0 = administrationT0.records as unknown as CbaRecord;
  const recordsT1 = administrationT1.records as unknown as CbaRecord;

  const populateCards = (): ReactElement[] => {
    const cards: ReactElement[] = [];
    const patologie = [
      'Ansia',
      'Benessere',
      'Cambiamento',
      'Depressione',
      'Disagio',
    ];

    const values = [
      {
        value: recordsT0.scores.ansia - recordsT1.scores.ansia,
      },
      {
        value: recordsT0.scores.benessere - recordsT1.scores.benessere,
      },
      {
        value: recordsT0.scores.cambiamento - recordsT1.scores.cambiamento,
      },
      {
        value: recordsT0.scores.depressione - recordsT1.scores.depressione,
      },
      {
        value: recordsT0.scores.disagio - recordsT1.scores.disagio,
      },
    ];

    for (let i = 0; i < patologie.length; i++) {
      const value = values[i];
      if (value === undefined) continue;

      cards.push(
        <ScoreCard
          key={i}
          patologia={patologie[i] ?? ''}
          punteggio={value.value ?? 0}
          compare
          z={0}
        />,
      );
    }

    return cards;
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-h1">CBA-VE</h1>
      <div className="flex w-1/3 flex-col">
        <AdministrationResultsTable
          columns={columnsCompare}
          data={[administrationT0, administrationT1]}
          questionnaire="cba-ve"
        />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="font-h2">Punteggi</h2>
        <div className="flex flex-row gap-4">
          {populateCards().map((card) => card)}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="font-h2">Interpretazione dei risultati</h2>
        <AdministrationChart
          firstLineData={[
            recordsT0.scores.ansia,
            recordsT0.scores.benessere,
            recordsT0.scores.cambiamento,
            recordsT0.scores.depressione,
            recordsT0.scores.disagio,
          ]}
          secondLineData={[
            recordsT1.scores.ansia,
            recordsT1.scores.benessere,
            recordsT1.scores.cambiamento,
            recordsT1.scores.depressione,
            recordsT1.scores.disagio,
          ]}
        />
      </div>
    </div>
  );
}
