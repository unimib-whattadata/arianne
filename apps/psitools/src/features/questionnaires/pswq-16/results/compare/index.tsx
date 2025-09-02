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
import type { DotGraphDataComparison } from '@/features/questionnaires/components/dot-graph';
import { DotGraph } from '@/features/questionnaires/components/dot-graph';
import type { ItemsListQuestions } from '@/features/questionnaires/components/items-list';
import { ItemsList } from '@/features/questionnaires/components/items-list';
import { LineGraph } from '@/features/questionnaires/components/line-graph';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/pswq-16/item';
import { QUESTIONS } from '@/features/questionnaires/pswq-16/questions';
import { cn } from '@/utils/cn';

const RESPONSES_DICT = {
  1: "Per nulla d'accordo",
  2: "Un poco d'accordo",
  3: "Abbastanza d'accordo",
  4: "Molto d'accordo",
  5: "Completamente d'accordo",
} as const;

type TValue = keyof typeof RESPONSES_DICT;

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
        {RESPONSES_DICT[currentValue]}
      </span>
    </div>
  );
};

export default function AdministrationResultsPswq16Page() {
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

  const questions = Object.entries(prevResponse).map(([key, value], index) => {
    const question = QUESTIONS[index];
    const reversePrevValue = question.reverse ? 6 - +value : +value;
    const reverseNextValue = question.reverse
      ? 6 - +nextResponse[key]
      : +nextResponse[key];

    return {
      id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
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

  const data = Object.entries(prevResponse).map(([key, value]) => ({
    index: key.split('-')[1],
    next: +nextResponse[key],
    prev: +value,
  })) satisfies DotGraphDataComparison;

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
    <AdministrationContentCompare
      isLoading={isLoading}
      type="pswq-16"
      administrations={[prevAdministration, nextAdministration]}
      title="Penn State Worry Questionnaire (PSWQ-16)"
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
          <LineGraph
            maxScore={80}
            scores={[
              { score: prevScore, T: prevAdministration.T },
              { score: nextScore, T: nextAdministration.T },
            ]}
            ticks={ticks()}
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
