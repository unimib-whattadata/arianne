'use client';

import { List, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { Shimmer } from '@/components/ui/schimmer';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { FormValues } from '@/features/questionnaires/asrm/item';
import { QUESTIONS } from '@/features/questionnaires/asrm/questions';
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
import type { LineGraphScore } from '@/features/questionnaires/components/line-graph';
import { LineGraph } from '@/features/questionnaires/components/line-graph';
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
            'flex rounded-lg px-2 font-semibold',
            isWorse && 'bg-red-200 text-red-500',
          )}
        >
          {value}
        </p>
      </span>
    </div>
  );
};

export default function AdministrationResultsASRMPage() {
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

  const { response: prevResponse, score: prevScore } =
    prevAdministration.records;
  const { response: nextResponse, score: nextScore } =
    nextAdministration.records;

  if (
    prevResponse === undefined ||
    prevScore === undefined ||
    nextResponse === undefined ||
    nextScore === undefined
  )
    return null;

  const prevExpressedSymptoms = Object.entries(prevResponse);
  const nextExpressedSymptoms = Object.entries(nextResponse);

  const prevExpressedSymptomsScore = prevExpressedSymptoms
    .map(([, record]) => parseInt(record) || 0)
    .reduce((acc, score) => acc + score + 1, 0) satisfies LineGraphScore;

  const nextExpressedSymptomsScore = nextExpressedSymptoms
    .map(([, record]) => parseInt(record) || 0)
    .reduce((acc, score) => acc + score + 1, 0) satisfies LineGraphScore;

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

  const data = Object.entries(prevResponse).map(([key, value]) => ({
    index: key.split('-')[1],
    prev: +value + 1,
    next: +nextResponse[key] + 1,
  })) satisfies DotGraphDataComparison;

  return (
    <AdministrationContentCompare
      isLoading={isLoading}
      type="asrm"
      administrations={[prevAdministration, nextAdministration]}
      title="Altman Self-Rating Mania Scale (ASRM)"
    >
      <h2 className="font-h2">Differenza tra le somministrazioni</h2>
      <div className="flex gap-2">
        <ComparisonCards
          prev={prevExpressedSymptomsScore}
          next={nextExpressedSymptomsScore}
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
          <CardDescription>Cut-off = 6</CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={25}
            scores={[
              { score: prevExpressedSymptomsScore, T: prevAdministration.T },
              { score: nextExpressedSymptomsScore, T: nextAdministration.T },
            ]}
            ticks={{ cutoff: 6, label: 'Cut-off', color: 'danger' }}
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
              domain={[1, 5]}
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
