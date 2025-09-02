'use client';

import { List, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/sckeleton';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { FormValues } from '@/features/questionnaires/aebs/item';
import { QUESTIONS } from '@/features/questionnaires/aebs/questions';
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
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import { cn } from '@/utils/cn';

const RESPONSES_DICT_1 = {
  1: 'Mai/Quasi mai',
  2: 'Qualche volta',
  3: 'Metà delle volte',
  4: 'Il più delle volte',
  5: 'Quasi sempre/Sempre',
} as const;

const RESPONSES_DICT_2 = {
  1: 'Fortemente in disaccordo',
  2: 'In disaccordo',
  3: 'Né in accordo né in disaccordo',
  4: 'In accordo',
  5: 'Fortemente in accordo',
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
  // Inverts logic comparison `reverse`
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
  questionId,
}: {
  currentValue: TValue2;
  otherValue: TValue2;
  questionId: number;
}) => {
  const question = QUESTIONS.find((q) => q.id === questionId);
  const isReverse = question?.reverse ?? false;
  // Inverts logic comparison `reverse`
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
        {RESPONSES_DICT_2[currentValue]}
      </span>
    </div>
  );
};

export default function AdministrationResultsAebsPage() {
  const [toggleValue, setToggleValue] = useState('dots');
  const [scale, setScale] = useState<string>('global');

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

  // Appetite Drive Score

  const prevDriveScore = parseInt(
    Object.entries(prevResponse)
      .slice(0, 9)
      .reduce((acc, [_, value]) => [
        acc[0],
        `${parseInt(acc[1]) + parseInt(value)}`,
      ])[1],
  );

  const nextDriveScore = parseInt(
    Object.entries(nextResponse)
      .slice(0, 9)
      .reduce((acc, [_, value]) => [
        acc[0],
        `${parseInt(acc[1]) + parseInt(value)}`,
      ])[1],
  );

  // Low Dietary Control Score

  const prevControlScore = parseInt(
    Object.entries(prevResponse)
      .slice(9, 15)
      .reduce((acc, [_, value]) => [
        acc[0],
        `${parseInt(acc[1]) + parseInt(value)}`,
      ])[1],
  );

  const nextControlScore = parseInt(
    Object.entries(nextResponse)
      .slice(9, 15)
      .reduce((acc, [_, value]) => [
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

  const questionsDrive = Object.entries(prevResponse)
    .filter(([,], index) => index >= 0 && index < 9)
    .map(([key, value], index) => {
      const question = QUESTIONS[index];
      const reversePrevValue = question.reverse ? 6 - +value : +value;
      const reverseNextValue = question.reverse
        ? 6 - +nextResponse[key]
        : +nextResponse[key];

      return {
        id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
        text: QUESTIONS[index].text,
        value: {
          prev: (
            <Value
              currentValue={+reversePrevValue as TValue}
              otherValue={+reverseNextValue as TValue}
              questionId={index + 1}
            />
          ),
          next: (
            <Value
              currentValue={+reverseNextValue as TValue}
              otherValue={+reversePrevValue as TValue}
              questionId={index + 1}
            />
          ),
        },
      };
    }) satisfies ItemsListQuestions;

  const questionsControl = Object.entries(prevResponse)

    .filter(([,], index) => index >= 9 && index <= 15)
    .map(([key, value], index) => {
      const question = QUESTIONS[index + 9];
      const reversePrevValue = question.reverse ? 6 - +value : +value;
      const reverseNextValue = question.reverse
        ? 6 - +nextResponse[key]
        : +nextResponse[key];

      return {
        id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
        text: QUESTIONS[index + 9].text,
        value: {
          prev: (
            <Value2
              currentValue={+reversePrevValue as TValue2}
              otherValue={+reverseNextValue as TValue2}
              questionId={index + 10}
            />
          ),
          next: (
            <Value2
              currentValue={+reverseNextValue as TValue2}
              otherValue={+reversePrevValue as TValue2}
              questionId={index + 10}
            />
          ),
        },
      };
    }) satisfies ItemsListQuestions;

  const renderItemsList = () => {
    let q: ItemsListQuestions;
    switch (scale) {
      case 'drive':
        q = questionsDrive;
        break;
      case 'control':
        q = questionsControl;
        break;
      default:
        q = [...questionsDrive, ...questionsControl];
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

  const driveData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return indexNumber >= 1 && indexNumber <= 9;
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  const controlData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return indexNumber > 9 && indexNumber <= 15;
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  const renderDotGraph = () => {
    let data: DotGraphDataComparison;
    switch (scale) {
      case 'drive':
        data = driveData;
        break;
      case 'control':
        data = controlData;
        break;
      default:
        data = globalData;
    }

    return (
      <DotGraph
        T={[prevAdministration.T, nextAdministration.T]}
        domain={[1, 5]}
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
      type="aebs"
      administrations={[prevAdministration, nextAdministration]}
      title="Addiction-like Eating Behaciors Scale (AEBS)"
    >
      <section className="space-y-2">
        <h2 className="font-h2 text-black">
          Differenza tra le somministrazioni
        </h2>
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
          <ComparisonCards
            prev={prevDriveScore}
            next={nextDriveScore}
            baseText="Appetite Drive"
            comparisonText={{
              positive: 'peggiorata',
              negative: 'migliorata',
              indifferent: 'rimasta invariata',
            }}
          />
          <ComparisonCards
            prev={prevControlScore}
            next={nextControlScore}
            baseText="Low Dietary Control"
            comparisonText={{
              positive: 'peggiorato',
              negative: 'migliorato',
              indifferent: 'rimasto invariato',
            }}
          />
        </div>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
          <CardDescription>
            <span className="block">Cut-off = 38</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={75}
            scores={[
              { score: prevScore, T: prevAdministration.T },
              { score: nextScore, T: nextAdministration.T },
            ]}
            ticks={[{ cutoff: 38, label: 'Cut-off', color: 'danger' }]}
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

          <div className="grid items-center gap-4">
            <ToggleGroup
              type="single"
              value={scale}
              onValueChange={(value) => setScale(value)}
              className="mb-4 flex w-full gap-0 rounded-md bg-input"
            >
              <ToggleGroupItem value="global" size="sm" className="flex-1">
                Scala globale
              </ToggleGroupItem>
              <ToggleGroupItem value="drive" size="sm" className="flex-1">
                Appetite Drive
              </ToggleGroupItem>
              <ToggleGroupItem value="control" size="sm" className="flex-1">
                Low Dietary Control
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {renderGraph()}
        </CardFooter>
      </Card>
    </AdministrationContentCompare>
  );
}
