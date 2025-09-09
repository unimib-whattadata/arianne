'use client';

import { Shimmer } from '@/components/ui/schimmer';
import type { FormValues } from '@/features/questionnaires/bha/item';
import { QUESTIONS } from '@/features/questionnaires/bha/questions';
import {
  AdministrationContentCompare,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/questionnaires/components/administration';
import { ComparisonCards } from '@/features/questionnaires/components/comparison-card';
import type { ItemsListQuestions } from '@/features/questionnaires/components/items-list';
import { ItemsList } from '@/features/questionnaires/components/items-list';
import { LineGraph } from '@/features/questionnaires/components/line-graph';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import { cn } from '@/utils/cn';

const Value = ({ value }: { value: string }) => {
  return (
    <span
      className={cn(
        'flex justify-center rounded-full px-2 font-semibold',
        value === 'true'
          ? 'bg-red-200 text-red-600'
          : 'bg-green-200 text-green-600',
      )}
    >
      {value === 'true' ? 'Vero' : 'Falso'}
    </span>
  );
};

export default function AdministrationResultsBhaPage() {
  const { administration, isLoading } = useAdministration<FormValues>({
    isComparison: true,
  });

  if (!administration || isLoading)
    return <Shimmer className="h-full w-full" />;

  const [prevAdministration, nextAdministration] = administration;

  if (!prevAdministration || !nextAdministration)
    return (
      <p>
        Errore nel ritrovamento delle informazioni relative alle
        somministrazioni.
      </p>
    );

  const { response: prevResponse } = prevAdministration.records;
  const { response: nextResponse } = nextAdministration.records;

  const prevExpressedSymptoms = Object.entries(prevResponse).filter(
    ([, record]) => record === 'true',
  );

  const prevExpressedSymptomsCount = prevExpressedSymptoms.length;

  const nextExpressedSymptoms = Object.entries(nextResponse).filter(
    ([, record]) => record === 'true',
  );

  const nextExpressedSymptomsCount = nextExpressedSymptoms.length;

  const questions = Object.entries(prevResponse).map(([id, record], index) => {
    return {
      id: QUESTIONS[index].index,
      text: QUESTIONS[index].text,
      value: {
        prev: <Value value={record} />,
        next: <Value value={nextResponse[id]} />,
      },
    };
  }) satisfies ItemsListQuestions;

  return (
    <AdministrationContentCompare
      isLoading={isLoading}
      type="bha"
      administrations={[prevAdministration, nextAdministration]}
      title="Brief Assessment of Hopelessness (BAH)"
    >
      <section>
        <h2 className="font-h2 pb-4">Differenza tra le somministrazioni</h2>
        <div className="flex gap-2">
          <ComparisonCards
            prev={prevExpressedSymptomsCount}
            next={nextExpressedSymptomsCount}
            baseText="I sintomi sono"
            comparisonText={{
              positive: 'peggiorati',
              negative: 'migliorati',
              indifferent: 'rimasti invariati',
            }}
          />
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Sintomi espressi</CardTitle>
          <CardDescription>Punteggio massimo = 7</CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={7}
            scores={[
              { T: prevAdministration.T, score: prevExpressedSymptomsCount },
              { T: nextAdministration.T, score: nextExpressedSymptomsCount },
            ]}
            ticks={[]}
          />
        </CardContent>
        <CardFooter>
          <ItemsList
            T={[prevAdministration.T, nextAdministration.T]}
            questions={questions}
          />
        </CardFooter>
      </Card>
    </AdministrationContentCompare>
  );
}
