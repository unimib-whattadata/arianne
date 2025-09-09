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
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/sps/item';
import { QUESTIONS } from '@/features/questionnaires/sps/questions';

const RESPONSES_DICT = {
  0: 'Per Nulla',
  1: 'Un poco',
  2: 'Abbastanza',
  3: 'Molto',
  4: 'Moltissimo',
};

type TValue = keyof typeof RESPONSES_DICT;

export default function AdministrationResultsGad7Page() {
  const Value = ({ value }: { value: TValue }) => {
    return (
      <div className="flex h-full">
        <Separator className="h-full w-px bg-slate-300" />
        <span className="flex px-2 font-semibold">{RESPONSES_DICT[value]}</span>
      </div>
    );
  };

  const [toggleValue, setToggleValue] = useState('dots');

  const { administration, isLoading, sex } = useAdministration<FormValues>({
    isComparison: false,
    hasSex: true,
  });

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

  const records = administration.records;

  const response = records.response;

  const score = parseInt(
    Object.entries(response).reduce((acc, [_, value]) => [
      acc[0],
      `${parseInt(acc[1]) + parseInt(value)}`,
    ])[1],
  );
  const questions = Object.entries(response).map(([_, value], index) => ({
    id: index + 1,
    text: QUESTIONS[index],
    value: <Value value={+value as TValue} />,
  })) satisfies ItemsListQuestions;

  const data = Object.entries(response).map(([key, value]) => ({
    index: key.split('-')[1],
    value: +value,
  })) satisfies DotGraphDataSingle;

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="sps"
      date={administration.date}
      T={administration.T}
    >
      <Card>
        <CardHeader>
          <CardTitle>Punteggio SPS</CardTitle>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={80}
            scores={score}
            ticks={[
              sex === 'M'
                ? { cutoff: 22, label: 'Cut-off', color: 'danger' }
                : { cutoff: 26, label: 'Cut-off', color: 'danger' },
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
            <DotGraph T={administration.T ?? 0} domain={[0, 4]} data={data} />
          ) : (
            <ItemsList questions={questions} />
          )}
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
}
