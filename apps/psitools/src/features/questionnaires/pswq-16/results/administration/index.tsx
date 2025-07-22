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
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/pswq-16/item';
import { QUESTIONS } from '@/features/questionnaires/pswq-16/questions';

const RESPONSES_DICT = {
  1: "Per nulla d'accordo",
  2: "Un poco d'accordo",
  3: "Abbastanza d'accordo",
  4: "Molto d'accordo",
  5: "Completamente d'accordo",
} as const;

type TValue = keyof typeof RESPONSES_DICT;

const Value = ({ value }: { value: TValue }) => {
  return (
    <div className="flex h-full">
      <Separator className="h-full w-px bg-slate-300" />
      <span className="flex px-2 font-semibold">{RESPONSES_DICT[value]}</span>
    </div>
  );
};

export default function AdministrationResultsPswq16Page() {
  const [toggleValue, setToggleValue] = useState('dots');

  const { administration, isLoading, sex } = useAdministration<FormValues>({
    isComparison: false,
    hasSex: true,
  });

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

  const { response, score } = administration.records;

  if (!response || !score) return null;

  const questions = Object.entries(response).map(([key, value], index) => {
    const question = QUESTIONS[index];
    const reverseValue = question.reverse ? 6 - +value : +value;

    return {
      id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
      text: question.text,
      value: <Value value={reverseValue as TValue} />,
    };
  }) satisfies ItemsListQuestions;

  const data = Object.entries(response).map(([key, value]) => ({
    index: key.split('-')[1],
    value: +value,
  })) satisfies DotGraphDataSingle;

  const ticks = () => {
    if (sex === 'M') {
      return [
        { cutoff: 27.7, label: 'Media' },
        { cutoff: 27.7 - 10.6, label: '-1&sigma;' },
        { cutoff: 27.7 + 10.6, label: '+1&sigma;' },
      ];
    }
    return [
      { cutoff: 34.4, label: 'Media' },
      { cutoff: 34.4 - 11.3, label: '-1&sigma;' },
      { cutoff: 34.4 + 11.3, label: '+1&sigma;' },
    ];
  };

  const mean = () => {
    if (sex === 'M') {
      return 27.7;
    }
    return 34.4;
  };
  const ds = () => {
    if (sex === 'M') {
      return 10.6;
    }
    return 11.3;
  };

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="pswq-16"
      date={administration.date}
      T={administration.T}
    >
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
          <CardDescription>
            <span className="block">M = {mean()}</span>
            <span className="block">DS = {ds()}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph maxScore={80} scores={score} ticks={ticks()} />
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
            <DotGraph T={administration.T ?? 0} domain={[1, 5]} data={data} />
          ) : (
            <ItemsList questions={questions} />
          )}
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
}
