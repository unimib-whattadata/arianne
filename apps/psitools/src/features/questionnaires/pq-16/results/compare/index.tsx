'use client';

import { Shimmer } from '@/components/ui/schimmer';
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
import type { DotGraphDataComparison } from '@/features/questionnaires/components/dot-graph';
import { DotGraph } from '@/features/questionnaires/components/dot-graph';
import type { ItemsListQuestions } from '@/features/questionnaires/components/items-list';
import { ItemsList } from '@/features/questionnaires/components/items-list';
import { LineGraph } from '@/features/questionnaires/components/line-graph';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/pq-16/item';
import { QUESTIONS } from '@/features/questionnaires/pq-16/questions';
import { cn } from '@/utils/cn';

const Value = ({ value }: { value: string }) => {
  return (
    <span
      className={cn(
        'flex justify-center rounded-full px-2 font-semibold',
        value === 'true' && 'bg-red-200 text-red-500',
      )}
    >
      {value === 'true' ? 'Sì' : 'No'}
    </span>
  );
};

export default function AdministrationResultsPQ16Page() {
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
    ([, record]) => record.value === 'true',
  );

  const prevExpressedSymptomsCount = prevExpressedSymptoms.length;
  const prevExpressedSymptomsScore = prevExpressedSymptoms
    .map(([, record]) => parseInt(record.score!) || 0)
    .reduce((acc, score) => acc + score, 0);

  const nextExpressedSymptoms = Object.entries(nextResponse).filter(
    ([, record]) => record.value === 'true',
  );

  const nextExpressedSymptomsCount = nextExpressedSymptoms.length;
  const nextExpressedSymptomsScore = nextExpressedSymptoms
    .map(([, record]) => parseInt(record.score!) || 0)
    .reduce((acc, score) => acc + score, 0);

  const questions = Object.entries(prevResponse).map(([id, record], index) => {
    return {
      id: QUESTIONS[index].index,
      text: QUESTIONS[index].text,
      value: {
        prev: <Value value={record.value} />,
        next: <Value value={nextResponse[id].value} />,
      },
    };
  }) satisfies ItemsListQuestions;

  const data = Object.entries(prevResponse).map(([id, value], index) => ({
    index: (index + 1).toString(),
    prev: value.score ? parseInt(value.score) : 0,
    next: nextResponse[id].score ? parseInt(nextResponse[id].score) : 0,
  })) satisfies DotGraphDataComparison;

  return (
    <AdministrationContentCompare
      isLoading={isLoading}
      type="pq-16"
      administrations={[prevAdministration, nextAdministration]}
      title="Questionario dei sintomi podromici (PQ-16)"
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
          <ComparisonCards
            prev={prevExpressedSymptomsScore}
            next={nextExpressedSymptomsScore}
            baseText="Il distress è"
            comparisonText={{
              positive: 'peggiorato',
              negative: 'migliorato',
              indifferent: 'rimasto invariato',
            }}
          />
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Sintomi espressi</CardTitle>
          <CardDescription>Cut-off = 6</CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={16}
            scores={[
              { T: prevAdministration.T, score: prevExpressedSymptomsCount },
              { T: nextAdministration.T, score: nextExpressedSymptomsCount },
            ]}
            ticks={{ cutoff: 6, label: 'Cut-off', color: 'danger' }}
          />
        </CardContent>
        <CardFooter>
          <ItemsList
            T={[prevAdministration.T, nextAdministration.T]}
            questions={questions}
          />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distress</CardTitle>
          <CardDescription>Cut-off = 8</CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={48}
            scores={[
              { T: prevAdministration.T, score: prevExpressedSymptomsScore },
              { T: nextAdministration.T, score: nextExpressedSymptomsScore },
            ]}
            ticks={{ cutoff: 8, label: 'Cut-off', color: 'danger' }}
          />
        </CardContent>
        <CardFooter>
          <DotGraph
            domain={[0, 3]}
            data={data}
            T={[prevAdministration.T, nextAdministration.T]}
          />
        </CardFooter>
      </Card>
    </AdministrationContentCompare>
  );
}
