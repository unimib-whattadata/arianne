'use client';

import { List, ScatterChart } from 'lucide-react';
import { useState } from 'react';

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
import type { FormValues } from '@/features/questionnaires/haq/item';
import { QUESTIONS } from '@/features/questionnaires/haq/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

const RESPONSES_DICT = {
  0: 'Mai o Raramente',
  1: 'Qualche volta',
  2: 'Spesso',
  3: 'Per la maggior parte del tempo',
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
    hasSex: true,
    isComparison: false,
  });

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

  const { response, score } = administration.records;

  if (!response || !score) return null;

  const globalQuestions = Object.entries(response).map(([_, value], index) => {
    return {
      id: index + 1,
      text: QUESTIONS[index].text,
      value: <Value value={+value as TValue} />,
    };
  }) satisfies ItemsListQuestions;

  const globalData = Object.entries(response).map(([key, value]) => ({
    index: key.split('-')[1],
    value: +value,
  })) satisfies DotGraphDataSingle;

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="haq"
      date={administration.date}
      T={administration.T}
    >
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={63}
            scores={score}
            ticks={[
              sex === 'M'
                ? { cutoff: 47, label: 'Cut-off', color: 'danger' }
                : { cutoff: 57, label: 'Cut-off', color: 'danger' },
            ]}
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
              domain={[0, 3]}
              data={globalData}
            />
          ) : (
            <ItemsList questions={globalQuestions} />
          )}
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
}
