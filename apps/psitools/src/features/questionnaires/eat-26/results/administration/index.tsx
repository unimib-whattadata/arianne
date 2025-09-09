'use client';

import { List, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/sckeleton';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  AdministrationContent,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/questionnaires/components/administration';
import type { DotGraphDataSingle } from '@/features/questionnaires/components/dot-graph';
import { DotGraph } from '@/features/questionnaires/components/dot-graph';
import type { ItemsListQuestions } from '@/features/questionnaires/components/items-list';
import { ItemsList } from '@/features/questionnaires/components/items-list';
import { LineGraph } from '@/features/questionnaires/components/line-graph';
import type { FormValues } from '@/features/questionnaires/eat-26/item';
import { QUESTIONS } from '@/features/questionnaires/eat-26/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

const RESPONSES_DICT_1 = {
  1: 'Mai',
  2: 'Raramente',
  3: 'Talvolta',
  4: 'Spesso',
  5: 'Di solito',
  6: 'Sempre',
} as const;

const RESPONSES_DICT_2 = {
  1: 'Mai',
  2: 'Da una fino a diverse volte al mese',
  3: 'Una volta alla settimana',
  4: 'Da due a sei volte alla settimana',
  5: 'Una volta al giorno',
  6: 'Più di una volta al giorno',
} as const;

type TValue = keyof typeof RESPONSES_DICT_1;
type TValue2 = keyof typeof RESPONSES_DICT_2;

const Value = ({ value }: { value: TValue }) => {
  return (
    <div className="flex h-full">
      <Separator className="h-full w-px bg-slate-300" />
      <span className="flex px-2 font-semibold">{RESPONSES_DICT_1[value]}</span>
    </div>
  );
};
const Value2 = ({ value }: { value: TValue2 }) => {
  return (
    <div className="flex h-full">
      <Separator className="h-full w-px bg-slate-300" />
      <span className="flex px-2 font-semibold">{RESPONSES_DICT_2[value]}</span>
    </div>
  );
};

export default function AdministrationResultsEat26Page() {
  const [toggleValue, setToggleValue] = useState('dots');

  const { administration, isLoading } = useAdministration<FormValues>();

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

  const records = administration.records;
  const testScore = administration.records?.score?.testScore ?? 0;

  const testQuestions = Object.entries(records.response)
    .filter(([,], index) => index >= 0 && index < 26)
    .map(([_, value], index) => {
      const question = QUESTIONS[index];
      const reverseValue = question.reverse ? 7 - +value : +value;

      return {
        id: `${index + 1}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: <Value value={reverseValue as TValue} />,
      };
    }) satisfies ItemsListQuestions;

  const behaviourQuestions = Object.entries(records.response)
    .filter(([,], index) => index >= 26)
    .map(([_, value], index) => {
      const question = QUESTIONS[index + 26];
      const reverseValue = question.reverse ? 6 - +value : +value;

      return {
        id: `${index + 1}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: <Value2 value={reverseValue as TValue2} />,
      };
    }) satisfies ItemsListQuestions;

  const testData = Object.entries(records.response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return indexNumber >= 1 && indexNumber <= 26;
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="eat-26"
      date={administration.date}
      T={administration.T}
    >
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
          <CardDescription>
            <span className="block">Cut-off = 19</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={78}
            scores={testScore}
            ticks={[{ cutoff: 19, label: 'Cut-off', color: 'danger' }]}
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
            <DotGraph
              T={administration.T ?? 0}
              domain={[1, 6]}
              data={testData}
            />
          ) : (
            <ItemsList questions={testQuestions} />
          )}
        </CardFooter>
      </Card>
      <Card>
        <div className="p-6">
          <h4>Domande comportamentali</h4>

          <div className="flex items-center pt-4 text-sm">
            <ItemsList questions={behaviourQuestions}></ItemsList>
          </div>
        </div>
      </Card>
    </AdministrationContent>
  );
}
