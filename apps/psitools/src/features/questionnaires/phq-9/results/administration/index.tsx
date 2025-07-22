'use client';

import { List, ScatterChart, TriangleAlert } from 'lucide-react';
import { useState } from 'react';

import { CardDescription } from '@/components/ui/card';
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

export default function AdministrationResultsPhq9Page() {
  const Value = ({ value }: { value: TValue }) => {
    return (
      <div className="flex h-full">
        <Separator className="h-full w-px bg-slate-300" />
        <span className="flex px-2 font-semibold">{RESPONSES_DICT[value]}</span>
      </div>
    );
  };

  const [toggleValue, setToggleValue] = useState('dots');

  const { administration, isLoading } = useAdministration<FormValues>();

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

  const records = administration.records;

  const response = records.response;

  const score = parseInt(
    Object.entries(response)
      .slice(0, 9)
      .reduce((acc, [_, value]) => [
        acc[0],
        `${parseInt(acc[1]) + parseInt(value)}`,
      ])[1],
  );

  const item9Score = parseInt(
    Object.entries(response)
      .slice(8, 9)
      .reduce((acc, [_, value]) => [
        acc[0],
        `${parseInt(acc[1]) + parseInt(value)}`,
      ])[1],
  );

  const questions = Object.entries(response)
    .slice(0, 9)
    .map(([_, value], index) => {
      const isNinthItem = index === 8;
      const isHighlighted = isNinthItem && parseInt(value) > 0;

      return {
        id: index + 1,
        text: QUESTIONS[index].text,
        value: (
          <div
            className={cn(
              'flex items-center gap-2',
              isHighlighted ? 'font-bold text-red-500' : 'text-slate-500',
            )}
          >
            <Value value={+value as TValue} />
            {isHighlighted && (
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
            )}{' '}
          </div>
        ),
      };
    }) satisfies ItemsListQuestions;

  const item10 = Object.entries(response)
    .slice(9, 10)
    .map(([_, option], index) => {
      const question = QUESTIONS[index + 9];
      const selectedOption =
        question.options[parseInt(option) - 1] || 'Opzione non valida';

      return {
        id: index + 10,
        text: question.text,
        value: selectedOption,
      };
    }) satisfies ItemsListQuestions;

  const data = Object.entries(response)
    .slice(0, 9)
    .map(([key, value]) => {
      return {
        index: key.split('-')[1],
        value: +value,
      };
    }) satisfies DotGraphDataSingle;

  const getScoreMessage = (score: number, item9Score: number): string => {
    let level = '';
    if (score <= 5) {
      level = 'assente';
    } else if (score > 5 && score <= 10) {
      level = 'lieve';
    } else if (score > 10 && score <= 15) {
      level = 'moderata';
    } else if (score > 15 && score <= 20) {
      level = 'maggiore';
    } else if (score > 20) {
      level = 'grave';
    }

    const withOrWithout =
      score > 5
        ? item9Score > 0
          ? ' con pensieri suicidari'
          : ' senza pensieri suicidari'
        : '';

    return `Depressione ${level}${withOrWithout ? ` ${withOrWithout}` : ''}`;
  };

  const iconColor =
    score <= 5
      ? 'text-green-500'
      : score > 5 && score <= 15
        ? 'text-yellow-500'
        : 'text-red-500';

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="phq-9"
      date={administration.date}
      T={administration.T}
    >
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
            scores={score}
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
                label: ' Depressione <br/> maggiore ',
                color: 'danger',
              },
              { cutoff: 20, label: 'Grave', color: 'danger' },
            ]}
          />
          <div className="flex gap-2 pt-14">
            <TriangleAlert className={`h-4 w-4 ${iconColor}`} />
            <small>{getScoreMessage(score, item9Score)}</small>
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
            <DotGraph T={administration.T ?? 0} domain={[0, 3]} data={data} />
          ) : (
            <div className="pb-4">
              <ItemsList questions={questions} />
              <Separator className="mb-10 mt-2" />
              <ItemsList questions={item10} />
            </div>
          )}
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
}
