'use client';

import { List, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { Shimmer } from '@/components/ui/schimmer';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
import type { FormValues } from '@/features/questionnaires/gss/item';
import { QUESTIONS } from '@/features/questionnaires/gss/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

const RESPONSES_DICT = {
  1: 'Mai vero',
  2: 'Quasi mai vero',
  3: 'Raramente vero',
  4: 'Ogni tanto vero',
  5: 'Spesso vero',
  6: 'Quasi sempre vero',
  7: 'Sempre vero',
} as const;

type TValue = keyof typeof RESPONSES_DICT;

const Value = ({ value }: { value: TValue }) => {
  return <span>{RESPONSES_DICT[value]}</span>;
};

export default function AdministrationResultsPage() {
  const [toggleValue, setToggleValue] = useState('dots');

  const { administration, isLoading } = useAdministration<FormValues>();
  if (!administration || isLoading)
    return <Shimmer className="h-full w-full" />;

  const records = administration.records;
  const response = records.response;

  const invertResponse = (questionIndex: number, value: number) => {
    if ([1, 5, 8].includes(questionIndex)) {
      switch (value) {
        case 7:
          return 1;
        case 6:
          return 2;
        case 5:
          return 3;
        case 4:
          return 5;
        case 3:
          return 6;
        case 2:
          return 7;
        case 1:
          return 7;
        default:
          return value;
      }
    }
    return value;
  };

  const expressedSymptoms = Object.entries(response);
  const expressedSymptomsScore = expressedSymptoms
    .map(([, record]) => parseInt(record) || 0)
    .reduce((acc, score) => acc + score, 0) satisfies LineGraphScore;

  const questions = Object.entries(response).map(([_, record], index) => {
    const questionIndex = index + 1;
    const invertedValue = invertResponse(questionIndex, parseInt(record));

    return {
      id: QUESTIONS[index].id,
      text: QUESTIONS[index].text,
      value: <Value value={invertedValue as TValue} />,
    };
  }) satisfies ItemsListQuestions;

  const data = Object.values(response).map((record, index) => ({
    index: (index + 1).toString(),
    value: record ? parseInt(record) : 0,
  })) satisfies DotGraphDataSingle;

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="gss"
      date={administration.date}
      T={administration.T}
    >
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
          <CardDescription>Punteggio minimo = 7</CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={63}
            scores={expressedSymptomsScore}
            ticks={{ cutoff: 7, label: 'Punteggio minimo' }}
          />
        </CardContent>
        <CardFooter>
          <ToggleGroup
            type="single"
            variant="outline"
            value={toggleValue}
            onValueChange={(value) => setToggleValue(value)}
            className="justify-end p-4 pr-0"
          >
            <ToggleGroupItem value="dots">
              <ScatterChart />
            </ToggleGroupItem>
            <ToggleGroupItem value="list">
              <List />
            </ToggleGroupItem>
          </ToggleGroup>
          {toggleValue === 'dots' ? (
            <DotGraph T={administration.T ?? 0} domain={[1, 7]} data={data} />
          ) : (
            <ItemsList questions={questions} />
          )}
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
}
