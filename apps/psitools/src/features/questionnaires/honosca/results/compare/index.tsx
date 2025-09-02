'use client';

import { List, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/sckeleton';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  AdministrationContentCompare,
  Card,
  CardContent,
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
import type { FormValues } from '@/features/questionnaires/honosca/item';
import { QUESTIONS } from '@/features/questionnaires/honosca/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import { cn } from '@/utils/cn';

const Value = ({
  value,
  currentValue,
  otherValue,
}: {
  value: string;
  currentValue: string;
  otherValue: string;
}) => {
  const isWorse = currentValue > otherValue;

  return (
    <div className="flex h-full space-x-2">
      <Separator className="h-full w-px bg-slate-300" />
      <span>
        <p
          className={cn(
            'flex rounded-md px-2 font-semibold',
            isWorse && 'bg-red-200 text-red-500',
          )}
        >
          {value}
        </p>
      </span>
    </div>
  );
};
export default function AdministrationResultsAebsPage() {
  const [toggleValue, setToggleValue] = useState('dots');
  const [scale] = useState<string>('global');

  const { administration, isLoading } = useAdministration<FormValues>({
    isComparison: true,
  });

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

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

  //Global score
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

  const questions = Object.entries(prevResponse).map(([id, record], index) => ({
    id: QUESTIONS[index].id,
    text: QUESTIONS[index].text,
    value: {
      prev: (
        <Value
          value={QUESTIONS[index].options[parseInt(record)]}
          currentValue={record}
          otherValue={nextResponse[id]}
        />
      ),
      next: (
        <Value
          value={QUESTIONS[index].options[parseInt(nextResponse[id])]}
          currentValue={nextResponse[id]}
          otherValue={record}
        />
      ),
    },
  })) satisfies ItemsListQuestions;

  const renderItemsList = () => {
    let q: ItemsListQuestions;
    switch (scale) {
      default:
        q = questions;
    }

    return (
      <ItemsList
        questions={q}
        T={[prevAdministration.T, nextAdministration.T]}
      />
    );
  };

  const globalData = Object.entries(prevResponse).map(([key, value]) => ({
    index: key.split('-')[1],
    next: +nextResponse[key],
    prev: +value,
  })) satisfies DotGraphDataComparison;

  const renderDotGraph = () => {
    let data: DotGraphDataComparison;
    switch (scale) {
      default:
        data = globalData;
    }

    return (
      <DotGraph
        T={[prevAdministration.T, nextAdministration.T]}
        domain={[0, 4]}
        data={data}
      />
    );
  };

  const renderGraph = () => {
    if (toggleValue === 'dots') return renderDotGraph();
    return renderItemsList();
  };

  return (
    <AdministrationContentCompare
      isLoading={isLoading}
      type="honosca"
      administrations={[prevAdministration, nextAdministration]}
      title="Health of the Nation Outcome Scales for Child and Adolescent Mental Health (HoNOSCA)"
    >
      <section>
        <h2 className="font-h2 pb-4">Differenza tra le somministrazioni</h2>
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
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Punteggio </CardTitle>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={60}
            scores={[
              { score: prevScore, T: prevAdministration.T },
              { score: nextScore, T: nextAdministration.T },
            ]}
            ticks={[]}
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

          {renderGraph()}
        </CardFooter>
      </Card>
    </AdministrationContentCompare>
  );
}
