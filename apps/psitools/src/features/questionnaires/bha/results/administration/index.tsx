'use client';

import { Shimmer } from '@/components/ui/schimmer';
import type { FormValues } from '@/features/questionnaires/bha/item';
import { QUESTIONS } from '@/features/questionnaires/bha/questions';
import {
  AdministrationContent,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/questionnaires/components/administration';
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
  const { administration, isLoading } = useAdministration<FormValues>();

  if (!administration || isLoading)
    return <Shimmer className="h-full w-full" />;

  const { response } = administration.records;

  const expressedSymptoms = Object.entries(response).filter(
    ([, record]) => record === 'true',
  );

  const expressedSymptomsCount = expressedSymptoms.length;

  //Gestione ids

  const questions = Object.entries(response).map(([_, record], index) => {
    return {
      id: QUESTIONS[index].index,
      text: QUESTIONS[index].text,
      value: <Value value={record} />,
    };
  }) satisfies ItemsListQuestions;

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="bha"
      date={administration.date}
      T={administration.T}
    >
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
        </CardHeader>
        <CardContent>
          <LineGraph maxScore={7} scores={expressedSymptomsCount} ticks={[]} />
        </CardContent>
        <CardFooter>
          <ItemsList questions={questions} />
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
}
