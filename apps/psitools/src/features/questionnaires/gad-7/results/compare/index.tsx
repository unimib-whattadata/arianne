'use client';

import { List, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { Shimmer } from '@/components/ui/schimmer';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
import type { FormValues } from '@/features/questionnaires/gad-7/item';
import { QUESTIONS } from '@/features/questionnaires/gad-7/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import { cn } from '@/utils/cn';

const RESPONSES_DICT = {
  0: 'Mai',
  1: 'Alcuni giorni',
  2: 'Per oltre la metà dei giorni',
  3: 'Quasi ogni giorno',
};

type TValue = keyof typeof RESPONSES_DICT;

const Value = ({
  currentValue,
  otherValue,
}: {
  currentValue: TValue;
  otherValue: TValue;
}) => {
  const isWorse = currentValue > otherValue;
  return (
    <div className="flex h-full space-x-2">
      <Separator className="h-full w-px bg-slate-300" />
      <span
        className={cn(
          'flex rounded-full px-2 font-semibold',
          isWorse && 'bg-red-200 text-red-500',
        )}
      >
        {RESPONSES_DICT[currentValue]}
      </span>
    </div>
  );
};

export default function AdministrationResultsGad7Page() {
  const [toggleValue, setToggleValue] = useState('dots');

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

  const prevScore = parseInt(
    Object.entries(prevResponse).reduce((acc, [_, value]) => [
      acc[0],
      `${parseInt(acc[1]) + parseInt(value)}`,
    ])[1],
  );

  const nextScore = parseInt(
    Object.entries(nextResponse).reduce((acc, [_, value]) => [
      acc[0],
      `${parseInt(acc[1]) + parseInt(value)}`,
    ])[1],
  );

  if (
    prevResponse === undefined ||
    prevScore === undefined ||
    nextResponse === undefined ||
    nextScore === undefined
  )
    return null;

  const questions = Object.entries(prevResponse).map(([key, value], index) => ({
    id: index + 1,
    text: QUESTIONS[index],
    value: {
      prev: (
        <Value
          currentValue={+value as TValue}
          otherValue={+nextResponse[key] as TValue}
        />
      ),
      next: (
        <Value
          currentValue={+nextResponse[key] as TValue}
          otherValue={+value as TValue}
        />
      ),
    },
  })) satisfies ItemsListQuestions;

  const data = Object.entries(prevResponse).map(([key, value]) => ({
    index: key.split('-')[1],
    next: +nextResponse[key],
    prev: +value,
  })) satisfies DotGraphDataComparison;

  return (
    <AdministrationContentCompare
      isLoading={isLoading}
      type="gad-7"
      administrations={[prevAdministration, nextAdministration]}
      title="General Anxiety Disorder-7 (GAD-7)"
    >
      <h2 className="font-h2">Differenza tra le somministrazioni</h2>
      <div className="flex gap-2">
        <ComparisonCards
          prev={prevScore}
          next={nextScore}
          baseText="I sintomi sono"
          comparisonText={{
            positive: 'peggiorati',
            negative: 'migliorati',
            indifferent: 'rimasti invariati',
          }}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
          <CardDescription>
            <span className="block">Cut-off = 10</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={21}
            scores={[
              { score: prevScore, T: prevAdministration.T },
              { score: nextScore, T: nextAdministration.T },
            ]}
            ticks={[
              { cutoff: 0, label: 'Assente' },
              { cutoff: 5, label: 'Lieve' },
              { cutoff: 10, label: 'Moderata (Cut-off)', color: 'warning' },
              { cutoff: 15, label: 'Grave', color: 'danger' },
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
              T={[prevAdministration.T, nextAdministration.T]}
              domain={[0, 3]}
              data={data}
            />
          ) : (
            <ItemsList
              T={[prevAdministration.T, nextAdministration.T]}
              questions={questions}
            />
          )}
        </CardFooter>
      </Card>
    </AdministrationContentCompare>
  );
}
