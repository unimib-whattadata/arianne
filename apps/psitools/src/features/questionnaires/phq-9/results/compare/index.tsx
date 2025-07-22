'use client';

import { List, ScatterChart, TriangleAlert } from 'lucide-react';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/sckeleton';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
import type { FormValues } from '@/features/questionnaires/phq-9/item';
import { QUESTIONS } from '@/features/questionnaires/phq-9/questions';
import { cn } from '@/utils/cn';

const RESPONSES_DICT = {
  0: 'Mai',
  1: 'Alcuni giorni',
  2: 'Per più della metà dei giorni',
  3: 'Quasi ogni giorno',
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
      <span>
        <p
          className={cn(
            'flex rounded-full px-2 font-semibold',
            isWorse && 'bg-red-200 text-red-500',
          )}
        >
          {RESPONSES_DICT[currentValue]}
        </p>
      </span>
    </div>
  );
};

interface Value2Props {
  currentValue: string;
  otherValue: string;
}

const Value2 = ({ currentValue, otherValue }: Value2Props) => {
  const isWorse = currentValue < otherValue;
  return (
    <div className="flex h-full space-x-2">
      <Separator className="h-full w-px bg-slate-300" />
      <span>
        <p
          className={cn(
            'flex rounded-full px-2 font-semibold',
            isWorse && 'bg-red-200 text-red-500',
          )}
        >
          {currentValue}
        </p>
      </span>
    </div>
  );
};

export default function AdministrationResultsPhq9Page() {
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

  const prevScore = parseInt(
    Object.entries(prevResponse)
      .slice(0, 9)
      .reduce((acc, [_, value]) => [
        acc[0],
        `${parseInt(acc[1]) + parseInt(value)}`,
      ])[1],
  );

  const nextScore = parseInt(
    Object.entries(nextResponse)
      .slice(0, 9)
      .reduce((acc, [_, value]) => [
        acc[0],
        `${parseInt(acc[1]) + parseInt(value)}`,
      ])[1],
  );

  const item9prev = parseInt(
    Object.entries(prevResponse)
      .slice(8, 9)
      .reduce((acc, [_, value]) => [
        acc[0],
        `${parseInt(acc[1]) + parseInt(value)}`,
      ])[1],
  );

  const item9next = parseInt(
    Object.entries(nextResponse)
      .slice(8, 9)
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

  const questions = Object.entries(prevResponse)
    .slice(0, 9)
    .map(([key, value], index) => {
      const isNinthItem = index === 8;
      const prevValue = +value as TValue;
      const nextValue = +nextResponse[key] as TValue;

      const isPrevHighlighted = isNinthItem && prevValue > 0;
      const isNextHighlighted = isNinthItem && nextValue > 0;

      return {
        id: index + 1,
        text: QUESTIONS[index].text,
        value: {
          prev: (
            <div className="flex items-center gap-2">
              <Value currentValue={prevValue} otherValue={nextValue} />
              {isPrevHighlighted && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TriangleAlert className="h-4 w-4 text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      align="start"
                      sideOffset={8}
                      className="ml-48 bg-red-100"
                    >
                      <p>Pensieri suicidari</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ),
          next: (
            <div className="flex items-center gap-2">
              <Value currentValue={nextValue} otherValue={prevValue} />
              {isNextHighlighted && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TriangleAlert className="h-4 w-4 text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      align="start"
                      sideOffset={8}
                      className="ml-48 bg-red-100"
                    >
                      <p>Pensieri suicidari</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ),
        },
      };
    }) satisfies ItemsListQuestions;

  const item10 = Object.entries(prevResponse)
    .slice(9, 10)
    .map(([key, option], _) => {
      const question = QUESTIONS.find((q) => q.id === 10);
      if (!question) {
        throw new Error('Domanda non trovata.');
      }

      const prevSelectedOption =
        question.options[parseInt(option) - 1] || 'Opzione non valida';

      const nextSelectedOption =
        question.options[parseInt(nextResponse[key]) - 1] ||
        'Opzione non valida';

      return {
        id: question.id,
        text: question.text,
        value: {
          prev: (
            <Value2
              currentValue={prevSelectedOption}
              otherValue={nextSelectedOption}
            />
          ),
          next: (
            <Value2
              currentValue={nextSelectedOption}
              otherValue={prevSelectedOption}
            />
          ),
        },
      };
    }) satisfies ItemsListQuestions;

  const data = Object.entries(prevResponse)
    .slice(0, 9)
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  const getScoreMessage = (item9prev: number, item9next: number): string => {
    let message = '';
    if (item9prev <= 0 && item9next <= 0) {
      message = `Nessun pensiero suicidario in T${prevAdministration.T} e T${nextAdministration.T}`;
    } else if (item9prev > 0 && item9next <= 0) {
      message = `Pensieri suicidari in T${prevAdministration.T}`;
    } else if (item9next > 0 && item9prev <= 0) {
      message = `Pensieri suicidari in T${nextAdministration.T}`;
    } else if (item9next > 0 && item9prev > 0) {
      message = `Pensieri suicidari in T${prevAdministration.T} e T${nextAdministration.T}`;
    }

    return `${message}`;
  };

  const iconColor =
    item9prev <= 0 && item9next <= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <AdministrationContentCompare
      isLoading={isLoading}
      type="phq-9"
      administrations={[prevAdministration, nextAdministration]}
      title="Patient Health Questionnaire 9 (PHQ-9)"
    >
      <ComparisonCards
        next={nextScore}
        prev={prevScore}
        baseText="I sintomi sono"
        comparisonText={{
          positive: 'peggiorati',
          negative: 'migliorati',
          indifferent: 'rimasti invariati',
        }}
      ></ComparisonCards>
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
          <CardDescription>
            <span className="block">Cut-off = 10</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={27}
            scores={[
              { score: prevScore, T: prevAdministration.T },
              { score: nextScore, T: nextAdministration.T },
            ]}
            ticks={[
              { cutoff: 0, label: 'Assente' },
              { cutoff: 5, label: 'Lieve', color: 'warning' },
              {
                cutoff: 10,
                label: 'Moderata <br/> (Cut-off)',
                color: 'warning',
              },
              {
                cutoff: 15,
                label: ' Depressione <br/> maggior ',
                color: 'danger',
              },
              { cutoff: 20, label: 'Grave', color: 'danger' },
            ]}
          />
          <div className="flex gap-2 pt-14">
            <TriangleAlert className={`h-4 w-4 ${iconColor}`} />
            <small>{getScoreMessage(item9prev, item9next)}</small>
          </div>
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
            <div className="pb-4">
              <ItemsList
                T={[prevAdministration.T, nextAdministration.T]}
                questions={questions}
              />
              <Separator className="mb-10 mt-2" />
              <ItemsList
                T={[prevAdministration.T, nextAdministration.T]}
                questions={item10}
              />
            </div>
          )}
        </CardFooter>
      </Card>
    </AdministrationContentCompare>
  );
}
