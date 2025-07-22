'use client';

import { Shimmer } from '@/components/ui/schimmer';
import {
  AdministrationContent,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/questionnaires/components/administration';
import type { DotGraphDataSingle } from '@/features/questionnaires/components/dot-graph';
import { DotGraph } from '@/features/questionnaires/components/dot-graph';
import type { ItemsListQuestions } from '@/features/questionnaires/components/items-list';
import { ItemsList } from '@/features/questionnaires/components/items-list';
import type { LineGraphScore } from '@/features/questionnaires/components/line-graph';
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

export default function AdministrationResultsPage() {
  const { administration, isLoading } = useAdministration<FormValues>();

  if (!administration || isLoading)
    return <Shimmer className="h-full w-full" />;

  const { response } = administration.records;

  const expressedSymptoms = Object.entries(response).filter(
    ([, record]) => record.value === 'true',
  );

  const expressedSymptomsCount = expressedSymptoms.length;

  const expressedSymptomsScore = expressedSymptoms
    .map(([, record]) => parseInt(record.score!) || 0)
    .reduce((acc, score) => acc + score, 0) satisfies LineGraphScore;

  const questions = Object.entries(response).map(([_, record], index) => {
    return {
      id: QUESTIONS[index].index,
      text: QUESTIONS[index].text,
      value: <Value value={record.value} />,
    };
  }) satisfies ItemsListQuestions;

  const data = Object.values(response).map((record, index) => ({
    index: (index + 1).toString(),
    value: record.score ? parseInt(record.score) : 0,
  })) satisfies DotGraphDataSingle;

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="pq-16"
      date={administration.date}
      T={administration.T}
    >
      <Card>
        <CardHeader>
          <CardTitle>Sintomi espressi</CardTitle>
          <CardDescription>Cut-off = 6</CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={16}
            scores={expressedSymptomsCount}
            ticks={{ cutoff: 6, label: 'Cut-off', color: 'danger' }}
          />
        </CardContent>
        <CardFooter>
          <ItemsList questions={questions} />
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
            scores={expressedSymptomsScore}
            ticks={{ cutoff: 8, label: 'Cut-off', color: 'danger' }}
          />
        </CardContent>
        <CardFooter>
          <DotGraph T={administration.T} domain={[0, 3]} data={data} />
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
}
