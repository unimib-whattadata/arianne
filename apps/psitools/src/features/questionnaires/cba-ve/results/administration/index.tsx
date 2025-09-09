'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import type { ReactElement } from 'react';

import { Shimmer } from '@/components/ui/schimmer';
import { AdministrationChart } from '@/features/questionnaires/cba-ve/administrationChart';
import { ScoreCard } from '@/features/questionnaires/cba-ve/score-card';
import { AdministrationCardDetail } from '@/features/questionnaires/components/administration-card-detail';
import { useTRPC } from '@/trpc/react';
import type { CbaRecord } from '@/types/cba-records';
import type { TView } from '@/types/view-types';
import { dateFormatting } from '@/utils/date-formatter';
import type { RouterOutputs } from '@arianne/api';

type Administration =
  RouterOutputs['administrations']['findUnique']['administration'];

const getAverageScores = (
  data: Administration[],
): {
  ansia: number;
  depressione: number;
  cambiamento: number;
  disagio: number;
  benessere: number;
} => {
  let ansiaAVG = 0;
  let disagioAVG = 0;
  let benessereAVG = 0;
  let cambiamentoAVG = 0;
  let depressioneAVG = 0;

  data.forEach((admin) => {
    const records = admin.records as unknown as CbaRecord;
    const scores = records.scores;
    ansiaAVG += scores.ansia;
    disagioAVG += scores.disagio;
    benessereAVG += scores.benessere;
    cambiamentoAVG += scores.cambiamento;
    depressioneAVG += scores.depressione;
  });

  return {
    ansia: ansiaAVG / data.length,
    disagio: disagioAVG / data.length,
    benessere: benessereAVG / data.length,
    cambiamento: cambiamentoAVG / data.length,
    depressione: depressioneAVG / data.length,
  };
};

const getStandardDeviation = (data: number[], average: number): number => {
  let scoreSum = 0;
  data.forEach((score) => {
    scoreSum += Math.pow(score - average, 2);
  });

  return Math.sqrt(scoreSum / (data.length - 1));
};

const ShowAdministrationResults = () => {
  const { view } = useParams<{ view: TView }>();
  const [_, administration] = view;

  const api = useTRPC();
  const { data: currentAdministration, isLoading } = useQuery(
    api.administrations.findUnique.queryOptions(
      { id: administration },
      {
        enabled: !!administration,
      },
    ),
  );
  const { data: allCBAdministrations, isLoading: allCBAisLoading } = useQuery(
    api.administrations.findMany.queryOptions({
      where: { type: 'cba-ve' },
    }),
  );

  if (
    !currentAdministration ||
    !allCBAdministrations ||
    allCBAisLoading ||
    isLoading
  )
    return <Shimmer className="h-full w-full" />;

  const records = currentAdministration.administration
    .records as unknown as CbaRecord;

  const adminAverageScores = getAverageScores(allCBAdministrations);
  const ansiaDS = getStandardDeviation(
    allCBAdministrations.map(
      (admin) => (admin.records as unknown as CbaRecord).scores.ansia,
    ),
    adminAverageScores.ansia,
  );
  const disagioDS = getStandardDeviation(
    allCBAdministrations.map(
      (admin) => (admin.records as unknown as CbaRecord).scores.disagio,
    ),
    adminAverageScores.disagio,
  );
  const benessereDS = getStandardDeviation(
    allCBAdministrations.map(
      (admin) => (admin.records as unknown as CbaRecord).scores.benessere,
    ),
    adminAverageScores.benessere,
  );
  const cambiamentoDS = getStandardDeviation(
    allCBAdministrations.map(
      (admin) => (admin.records as unknown as CbaRecord).scores.cambiamento,
    ),
    adminAverageScores.cambiamento,
  );
  const depressioneDS = getStandardDeviation(
    allCBAdministrations.map(
      (admin) => (admin.records as unknown as CbaRecord).scores.depressione,
    ),
    adminAverageScores.depressione,
  );

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
        value: records.scores.ansia,
        avg: adminAverageScores.ansia,
        st: ansiaDS,
      },
      {
        value: records.scores.benessere,
        avg: adminAverageScores.benessere,
        st: benessereDS,
      },
      {
        value: records.scores.cambiamento,
        avg: adminAverageScores.cambiamento,
        st: cambiamentoDS,
      },
      {
        value: records.scores.depressione,
        avg: adminAverageScores.depressione,
        st: depressioneDS,
      },
      {
        value: records.scores.disagio,
        avg: adminAverageScores.disagio,
        st: disagioDS,
      },
    ];

    for (let i = 0; i < patologie.length; i++) {
      const value = values[i];
      if (value === undefined) continue;
      let zScore = (value.value - value.avg) / value.st;
      if (isNaN(zScore)) zScore = 0;
      const z = parseFloat(zScore.toFixed(2));
      if (z === undefined) continue;

      cards.push(
        <ScoreCard
          key={i}
          className="min-w-[250px]"
          patologia={patologie[i] ?? ''}
          punteggio={value.value ?? 0}
          z={z}
        />,
      );
    }

    return cards;
  };

  return (
    <div className="flex flex-col gap-8">
      {isLoading ? (
        <Shimmer className="h-full w-full" />
      ) : (
        <AdministrationCardDetail
          testType={
            currentAdministration.administration.type ?? 'Dato non trovato'
          }
          testNumber="T0"
          date={dateFormatting(
            currentAdministration.administration.date ?? new Date(),
            'dd/MM/yyyy',
          )}
        />
      )}
      <div className="flex flex-col gap-4">
        <h2 className="font-h2">Punteggi</h2>
        <div className="flex flex-row gap-4">
          {populateCards().map((card) => card)}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="font-h2">Interpretazione dei risultati</h2>
        {isLoading ? (
          <Shimmer className="h-full w-full" />
        ) : (
          <AdministrationChart
            firstLineData={[
              records.scores.ansia,
              records.scores.benessere,
              records.scores.cambiamento,
              records.scores.depressione,
              records.scores.disagio,
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default ShowAdministrationResults;
