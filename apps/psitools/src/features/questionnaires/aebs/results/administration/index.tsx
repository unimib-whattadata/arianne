'use client';

import { List, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/sckeleton';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { FormValues } from '@/features/questionnaires/aebs/item';
import { QUESTIONS } from '@/features/questionnaires/aebs/questions';
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

const Value = ({ value }: { value: TValue }) => {
  return (
    <div className="flex h-full">
      <Separator className="h-full w-px bg-slate-300" />
      <span className="flex px-2 font-semibold">{RESPONSES_DICT_1[value]}</span>
    </div>
  );
};
const Value2 = ({ value }: { value: TValue2 }) => {
  return (
    <div className="flex h-full">
      <Separator className="h-full w-px bg-slate-300" />
      <span className="flex px-2 font-semibold">{RESPONSES_DICT_2[value]}</span>
    </div>
  );
};

export default function AdministrationResultsAebsPage() {
  const [toggleValue, setToggleValue] = useState('dots');
  const [scale, setScale] = useState<string>('global');

  const { administration, isLoading } = useAdministration<FormValues>();

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

  const appetiteDriveScore = parseInt(
    Object.entries(response)
      .slice(0, 9)
      .reduce((acc, [_, value]) => [
        acc[0],
        `${parseInt(acc[1]) + parseInt(value)}`,
      ])[1],
  );

  const lowDietaryControlScore = parseInt(
    Object.entries(response)
      .slice(9, 15)
      .reduce((acc, [_, value]) => [
        acc[0],
        `${parseInt(acc[1]) + parseInt(value)}`,
      ])[1],
  );

  const questionsDrive = Object.entries(response)
    .filter(([,], index) => index >= 0 && index < 9)
    .map(([_, value], index) => {
      const question = QUESTIONS[index];
      const reverseValue = question.reverse ? 6 - +value : +value;

      return {
        id: `${index + 1}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: <Value value={reverseValue as TValue} />,
      };
    }) satisfies ItemsListQuestions;

  const questionsControl = Object.entries(response)
    .filter(([,], index) => index >= 9 && index <= 15)
    .map(([_, value], index) => {
      const question = QUESTIONS[index + 9];
      const reverseValue = question.reverse ? 6 - +value : +value;

      return {
        id: `${index + 10}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: <Value2 value={reverseValue as TValue2} />,
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

    return <ItemsList questions={q} />;
  };

  const globalData = Object.entries(response).map(([key, value]) => ({
    index: key.split('-')[1],
    value: +value,
  })) satisfies DotGraphDataSingle;

  const driveData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return indexNumber >= 1 && indexNumber <= 9;
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  const controlData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return indexNumber > 9 && indexNumber <= 15;
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  const renderDotGraph = () => {
    let data: DotGraphDataSingle;
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

    return <DotGraph T={administration.T ?? 0} domain={[1, 5]} data={data} />;
  };

  const renderGraph = () => {
    if (toggleValue === 'dots') return renderDotGraph();
    return renderItemsList();
  };

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="aebs"
      date={administration.date}
      T={administration.T}
    >
      <div className="flex gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-center">Fattore </div>
            <span className="flex min-w-40 justify-center font-semibold">
              Appetite Drive
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div
                className={cn(
                  'flex h-16 w-16 items-center justify-center self-center rounded-full bg-emerald-400 p-4',
                )}
              >
                <span className={cn('relative text-lg font-bold text-white')}>
                  {appetiteDriveScore}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex justify-center">Fattore </div>
            <span className="flex min-w-40 justify-center font-semibold">
              {' '}
              Low Dietary Control
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div
                className={cn(
                  'flex h-16 w-16 items-center justify-center self-center rounded-full bg-emerald-400 p-4',
                )}
              >
                <span className={cn('relative text-lg font-bold text-white')}>
                  {lowDietaryControlScore}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
            scores={score}
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
    </AdministrationContent>
  );
}
