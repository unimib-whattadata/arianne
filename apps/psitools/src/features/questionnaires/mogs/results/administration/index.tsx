'use client';

import { AlignLeft, List, LoaderCircle, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/sckeleton';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
import { ScoreCard } from '@/features/questionnaires/components/score-card';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/mogs/item';
import { QUESTIONS } from '@/features/questionnaires/mogs/questions';

const RESPONSES_DICT = {
  1: 'Per nulla',
  2: 'Poco',
  3: 'Abbastanza',
  4: 'Molto',
  5: 'Moltissimo',
} as const;
const MNV_QUESTIONS = [5, 6, 7, 9, 14, 15];
const EMP_QUESTIONS = [2, 10, 13, 16, 17];
const MODI_QUESTIONS = [1, 8, 12];
const HARM_QUESTIONS = [3, 4, 11];

type TValue = keyof typeof RESPONSES_DICT;

const Value = ({ value }: { value: TValue }) => {
  return (
    <div className="flex h-full">
      <Separator className="h-full w-px bg-slate-300" />
      <span className="flex px-2 font-semibold">{RESPONSES_DICT[value]}</span>
    </div>
  );
};

export default function AdministrationResultsPswq16Page() {
  const [toggleValue, setToggleValue] = useState('dots');
  const [toggleGraph, setToggleGraph] = useState<string>('chart');
  const [scale, setScale] = useState<string>('global');

  const { administration, isLoading } = useAdministration<FormValues>();

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

  const { response, score } = administration.records;

  if (!response || !score) return null;

  const globalQuestions = Object.entries(response).map(([_, value], index) => ({
    id: index + 1,
    text: QUESTIONS[index].text,
    value: <Value value={+value as TValue} />,
  })) satisfies ItemsListQuestions;

  const mnvQuestions = MNV_QUESTIONS.map((index) => {
    const responseKey = `item-${index}`;
    return {
      id: index,
      text: QUESTIONS[index - 1].text,
      value: <Value value={+response[responseKey] as TValue} />,
    };
  }) satisfies ItemsListQuestions;

  const empathyQuestions = EMP_QUESTIONS.map((index) => {
    const responseKey = `item-${index}`;
    return {
      id: index,
      text: QUESTIONS[index - 1].text,
      value: <Value value={+response[responseKey] as TValue} />,
    };
  }) satisfies ItemsListQuestions;

  const modiQuestions = MODI_QUESTIONS.map((index) => {
    const responseKey = `item-${index}`;
    return {
      id: index,
      text: QUESTIONS[index - 1].text,
      value: <Value value={+response[responseKey] as TValue} />,
    };
  }) satisfies ItemsListQuestions;

  const harmQuestions = HARM_QUESTIONS.map((index) => {
    const responseKey = `item-${index}`;
    return {
      id: index,
      text: QUESTIONS[index - 1].text,
      value: <Value value={+response[responseKey] as TValue} />,
    };
  }) satisfies ItemsListQuestions;

  const globalData = Object.entries(response).map(([key, value]) => ({
    index: key.split('-')[1],
    value: +value,
  })) satisfies DotGraphDataSingle;

  const mnvData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return MNV_QUESTIONS.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;
  const empathyData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return EMP_QUESTIONS.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;
  const modiData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return MODI_QUESTIONS.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;
  const harmData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return HARM_QUESTIONS.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  const renderDotGraph = () => {
    let data: DotGraphDataSingle;
    switch (scale) {
      case 'mnv':
        data = mnvData;
        break;
      case 'empathy':
        data = empathyData;
        break;
      case 'modi':
        data = modiData;
        break;
      case 'harm':
        data = harmData;
        break;
      default:
        data = globalData;
    }

    return <DotGraph T={administration.T ?? 0} domain={[1, 5]} data={data} />;
  };

  const renderItemsList = () => {
    let q: ItemsListQuestions;
    switch (scale) {
      case 'mnv':
        q = mnvQuestions;
        break;
      case 'empathy':
        q = empathyQuestions;
        break;
      case 'modi':
        q = modiQuestions;
        break;
      case 'harm':
        q = harmQuestions;
        break;

      default:
        q = globalQuestions;
    }

    return <ItemsList questions={q} />;
  };
  const renderGraph = () => {
    if (toggleValue === 'dots') return renderDotGraph();
    return renderItemsList();
  };

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="mogs"
      date={administration.date}
      T={administration.T}
    >
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
          <ToggleGroup
            type="single"
            variant="outline"
            value={toggleGraph}
            onValueChange={(value) => setToggleGraph(value)}
            className="h-9 justify-end p-4 pr-0"
          >
            <ToggleGroupItem value="chart" size="sm" className="h-9 px-[12px]">
              <LoaderCircle className="mr-1 h-6 w-6" /> Sintesi
            </ToggleGroupItem>
            <ToggleGroupItem value="list" size="sm" className="h-9 px-[12px]">
              <AlignLeft className="mr-1 h-6 w-6" /> Dettagli
            </ToggleGroupItem>
          </ToggleGroup>
          <CardDescription></CardDescription>
        </CardHeader>

        <CardContent>
          {toggleGraph === 'chart' ? (
            <div className="flex min-w-[670px]">
              <ScoreCard
                score={score.MNV + score.EMP + score.MODI + score.HARM}
                label="Scala globale"
              />
              <Separator orientation="vertical" className="w-1px mt-7 h-28" />
              <ScoreCard score={score.MNV} label="MNV" />
              <ScoreCard score={score.EMP} label="Empathy" />
              <ScoreCard score={score.MODI} label="MODI" />
              <ScoreCard score={score.HARM} label="Harm" />
            </div>
          ) : (
            <>
              <div className="pb-2">
                <LineGraph
                  maxScore={65}
                  label="Scala globale"
                  scores={score.MNV + score.EMP + score.MODI + score.HARM}
                  ticks={[{ cutoff: 17, label: 'Punteggio minimo' }]}
                />
              </div>

              <Separator
                orientation="horizontal"
                className="h-1px mt-7 w-full"
              />

              <div className="pt-2">
                <LineGraph
                  maxScore={30}
                  label="MNV"
                  scores={score.MNV}
                  ticks={[{ cutoff: 6, label: 'Punteggio minimo' }]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={25}
                  label="Empathy"
                  scores={score.EMP}
                  ticks={[{ cutoff: 5, label: 'Punteggio minimo' }]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={15}
                  label="MODI"
                  scores={score.MODI}
                  ticks={[{ cutoff: 3, label: 'Punteggio minimo' }]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={15}
                  label="Harm"
                  scores={score.HARM}
                  ticks={[{ cutoff: 3, label: 'Punteggio minimo' }]}
                />
              </div>
            </>
          )}
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
              <ToggleGroupItem value="mnv" size="sm" className="flex-1">
                MNV
              </ToggleGroupItem>
              <ToggleGroupItem value="empathy" size="sm" className="flex-1">
                Empathy
              </ToggleGroupItem>
              <ToggleGroupItem value="modi" size="sm" className="flex-1">
                MODI
              </ToggleGroupItem>
              <ToggleGroupItem value="harm" size="sm" className="flex-1">
                Harm
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {renderGraph()}
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
}
