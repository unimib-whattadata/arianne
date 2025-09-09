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
import type { FormValues } from '@/features/questionnaires/eat-26/item';
import { QUESTIONS } from '@/features/questionnaires/eat-26/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import { cn } from '@/utils/cn';

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

const Value = ({
  currentValue,
  otherValue,
  questionId,
}: {
  currentValue: TValue;
  otherValue: TValue;
  questionId: number;
}) => {
  const question = QUESTIONS.find((q) => q.id === questionId);
  const isReverse = question?.reverse ?? false;

  // Inverte la logica di confronto se è una domanda `reverse`
  const isWorse = isReverse
    ? currentValue < otherValue
    : currentValue > otherValue;

  return (
    <div className="flex h-full space-x-2">
      <Separator className="h-full w-px bg-slate-300" />
      <span
        className={cn(
          'flex rounded-full px-2 font-semibold',
          isWorse && 'bg-red-200 text-red-500',
        )}
      >
        {RESPONSES_DICT_1[currentValue]}
      </span>
    </div>
  );
};

const Value2 = ({
  currentValue,
  otherValue,
}: {
  currentValue: TValue2;
  otherValue: TValue2;
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
        {RESPONSES_DICT_2[currentValue]}
      </span>
    </div>
  );
};

export default function AdministrationResultsEat26Page() {
  const [toggleValue, setToggleValue] = useState('dots');

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

  const prevTestScore = prevAdministration.records.score?.testScore;
  const nextTestScore = nextAdministration.records.score?.testScore;

  if (
    prevResponse === undefined ||
    prevTestScore === undefined ||
    nextResponse === undefined ||
    nextTestScore === undefined
  )
    return null;

  const testQuestions = Object.entries(prevResponse)
    .filter(([,], index) => index >= 0 && index < 26)
    .map(([key, value], index) => {
      const question = QUESTIONS[index];
      const reversePrevValue = question.reverse ? 7 - +value : +value;
      const reverseNextValue = question.reverse
        ? 7 - +nextResponse[key]
        : +nextResponse[key];

      return {
        id: index + 1,
        text: question.text,
        value: {
          prev: (
            <Value
              currentValue={reversePrevValue as TValue}
              otherValue={reverseNextValue as TValue}
              questionId={question.id}
            />
          ),
          next: (
            <Value
              currentValue={reverseNextValue as TValue}
              otherValue={reversePrevValue as TValue}
              questionId={question.id}
            />
          ),
        },
      };
    }) satisfies ItemsListQuestions;

  const behaviourQuestions = Object.entries(prevResponse)
    .filter(([,], index) => index >= 26)
    .map(([key, value], index) => ({
      id: index + 27,
      text: QUESTIONS[index + 26].text,
      value: {
        prev: (
          <Value2
            currentValue={+value as TValue2}
            otherValue={+nextResponse[key] as TValue2}
          />
        ),
        next: (
          <Value2
            currentValue={+nextResponse[key] as TValue2}
            otherValue={+value as TValue2}
          />
        ),
      },
    })) satisfies ItemsListQuestions;

  const testData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return indexNumber >= 1 && indexNumber <= 26;
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  return (
    <AdministrationContentCompare
      isLoading={isLoading}
      type="eat-26"
      administrations={[prevAdministration, nextAdministration]}
      title="Eating Attitude Test 26 (EAT-26)"
    >
      <ComparisonCards
        prev={prevTestScore}
        next={nextTestScore}
        baseText="Il paziente è"
        comparisonText={{
          positive: 'peggiorato',
          negative: 'migliorato',
          indifferent: 'rimasto invariato',
        }}
      ></ComparisonCards>
      <Card>
        <CardHeader>
          <CardTitle>Differenza tra le somministrazioni</CardTitle>

          <CardTitle>Punteggio</CardTitle>
          <CardDescription>
            <span className="block">Cut-off = 19</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={78}
            scores={[
              { score: prevTestScore, T: prevAdministration.T },
              { score: nextTestScore, T: nextAdministration.T },
            ]}
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
              T={[prevAdministration.T, nextAdministration.T]}
              domain={[1, 6]}
              data={testData}
            />
          ) : (
            <ItemsList
              questions={testQuestions}
              T={[prevAdministration.T, nextAdministration.T]}
            />
          )}
        </CardFooter>
      </Card>
      <Card>
        <div className="p-6">
          <h4>Domande comportamentali</h4>

          <div className="flex items-center pt-4 text-sm">
            <ItemsList
              questions={behaviourQuestions}
              T={[prevAdministration.T, nextAdministration.T]}
            ></ItemsList>
          </div>
        </div>
      </Card>
    </AdministrationContentCompare>
  );
}
