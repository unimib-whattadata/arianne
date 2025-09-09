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
import type { FormValues } from '@/features/questionnaires/haq/item';
import { QUESTIONS } from '@/features/questionnaires/haq/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import { cn } from '@/utils/cn';

const RESPONSES_DICT = {
  0: 'Mai o Raramente',
  1: 'Qualche volta',
  2: 'Spesso',
  3: 'Per la maggior parte del tempo',
} as const;

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

export default function AdministrationResultsIusRPage() {
  const [toggleValue, setToggleValue] = useState('dots');

  const { administration, isLoading, sex } = useAdministration<FormValues>({
    isComparison: true,
    hasSex: true,
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

  const prevRecords = prevAdministration?.records;
  const nextRecords = nextAdministration?.records;

  const prevResponse = prevRecords.response;
  const nextResponse = nextRecords.response;

  const prevScore = prevRecords.score;
  const nextScore = nextRecords.score;

  if (
    prevResponse === undefined ||
    prevScore === undefined ||
    nextResponse === undefined ||
    nextScore === undefined
  )
    return null;

  //PrevT data

  const globalQuestions = Object.entries(prevResponse).map(
    ([key, value], index) => ({
      id: index + 1,
      text: QUESTIONS[index].text,
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
    }),
  ) satisfies ItemsListQuestions;

  const globalData = Object.entries(prevResponse).map(([key, value]) => ({
    index: key.split('-')[1],
    next: +nextResponse[key],
    prev: +value,
  })) satisfies DotGraphDataComparison;

  return (
    <AdministrationContentCompare
      isLoading={isLoading}
      type="haq"
      administrations={[prevAdministration, nextAdministration]}
      title="Health Anxiety Questionnaire (HAQ)"
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
        </CardHeader>

        <CardContent>
          <LineGraph
            maxScore={63}
            scores={[
              { score: prevScore, T: prevAdministration.T },
              { score: nextScore, T: nextAdministration.T },
            ]}
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
              <ScatterChart className="mr-1 h-6 w-6" /> Sintesi
            </ToggleGroupItem>
            <ToggleGroupItem value="list">
              <List className="mr-1 h-6 w-6" /> Dettagli
            </ToggleGroupItem>
          </ToggleGroup>

          <ToggleGroup
            type="single"
            variant="outline"
            value={toggleValue}
            onValueChange={(value) => setToggleValue(value)}
            className="justify-end p-4 pr-0"
          ></ToggleGroup>
          {toggleValue === 'dots' ? (
            <DotGraph
              T={[prevAdministration.T, nextAdministration.T]}
              domain={[0, 3]}
              data={globalData}
            />
          ) : (
            <ItemsList
              T={[prevAdministration.T, nextAdministration.T]}
              questions={globalQuestions}
            />
          )}
        </CardFooter>
      </Card>
    </AdministrationContentCompare>
  );
}
