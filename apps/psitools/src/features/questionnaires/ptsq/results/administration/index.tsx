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
import type { FormValues } from '@/features/questionnaires/ptsq/item';
import { QUESTIONS } from '@/features/questionnaires/ptsq/questions';

const RESPONSES_DICT = {
  1: 'Per nulla',
  2: 'Poco',
  3: 'Un poco',
  4: 'Molto',
  5: 'Moltissimo',
} as const;

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

  const intrusivenesScore = [1, 2, 3, 4];
  const avoidanceScore = [5, 6, 7, 8];
  const iperarousalScore = [9, 10, 11, 12];

  const globalQuestions = Object.entries(response).map(([_, value], index) => {
    return {
      id: index + 1,
      text: QUESTIONS[index].text,
      value: <Value value={+value as TValue} />,
    };
  }) satisfies ItemsListQuestions;

  const avoidanceScoreQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return avoidanceScore.includes(+id);
    })
    .map(([_, value], index) => ({
      id: avoidanceScore[index],
      text: QUESTIONS[avoidanceScore[index] - 1].text,
      value: <Value value={+value as TValue} />,
    })) satisfies ItemsListQuestions;

  const intrusivenesScoreQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return intrusivenesScore.includes(+id);
    })
    .map(([_, value], index) => ({
      id: intrusivenesScore[index],
      text: QUESTIONS[intrusivenesScore[index] - 1].text,
      value: <Value value={+value as TValue} />,
    })) satisfies ItemsListQuestions;

  const iperarousalScoreQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return iperarousalScore.includes(+id);
    })
    .map(([_, value], index) => ({
      id: iperarousalScore[index],
      text: QUESTIONS[iperarousalScore[index] - 1].text,
      value: <Value value={+value as TValue} />,
    })) satisfies ItemsListQuestions;

  const globalData = Object.entries(response).map(([key, value]) => ({
    index: key.split('-')[1],
    value: +value,
  })) satisfies DotGraphDataSingle;

  const avoidanceScoreData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return avoidanceScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  const intrusivenesScoreData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1]);
      return intrusivenesScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  const iperarousalScoreData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1]);
      return iperarousalScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  const renderDotGraph = () => {
    let data: DotGraphDataSingle;
    switch (scale) {
      case 'avoidanceScore':
        data = avoidanceScoreData;
        break;
      case 'intrusivenesScore':
        data = intrusivenesScoreData;
        break;
      case 'iperarousalScore':
        data = iperarousalScoreData;
        break;
      default:
        data = globalData;
    }

    return <DotGraph T={administration.T ?? 0} domain={[1, 5]} data={data} />;
  };

  const renderItemsList = () => {
    let q: ItemsListQuestions;
    switch (scale) {
      case 'avoidanceScore':
        q = avoidanceScoreQuestions;
        break;
      case 'intrusivenesScore':
        q = intrusivenesScoreQuestions;
        break;
      case 'iperarousalScore':
        q = iperarousalScoreQuestions;
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
      type="ptsq"
      date={administration.date}
      T={administration.T}
    >
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
          <CardDescription>
            <span className="block">Cut-off = 32</span>
          </CardDescription>
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
        </CardHeader>

        <CardContent>
          {toggleGraph === 'chart' ? (
            <div className="flex min-w-[670px]">
              <ScoreCard
                score={
                  score.avoidanceScore +
                  score.intrusivenesScore +
                  score.iperarousalScore
                }
                label="Punteggio Totale"
              />
              <Separator orientation="vertical" className="w-1px mt-7 h-28" />
              <ScoreCard score={score.intrusivenesScore} label="Intrusività" />
              <ScoreCard score={score.avoidanceScore} label="Evitamento" />

              <ScoreCard score={score.iperarousalScore} label="Iperarousal" />
            </div>
          ) : (
            <>
              <div className="pb-2">
                <LineGraph
                  maxScore={60}
                  label="Punteggio Totale"
                  scores={
                    score.avoidanceScore +
                    score.intrusivenesScore +
                    score.iperarousalScore
                  }
                  ticks={[{ cutoff: 32, label: 'Cut-off', color: 'danger' }]}
                />
              </div>

              <Separator
                orientation="horizontal"
                className="h-1px mt-7 w-full"
              />
              <div className="pt-2">
                <LineGraph
                  maxScore={20}
                  label="Intrusività"
                  scores={score.intrusivenesScore}
                  ticks={[]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={20}
                  label="Evitamento"
                  scores={score.avoidanceScore}
                  ticks={[]}
                />
              </div>

              <div className="pt-2">
                <LineGraph
                  maxScore={20}
                  label="Iperarousal"
                  scores={score.iperarousalScore}
                  ticks={[]}
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
                Punteggio Totale
              </ToggleGroupItem>
              <ToggleGroupItem
                value="intrusivenesScore"
                size="sm"
                className="flex-1"
              >
                Intrusività
              </ToggleGroupItem>
              <ToggleGroupItem
                value="avoidanceScore"
                size="sm"
                className="flex-1"
              >
                Evitamento
              </ToggleGroupItem>

              <ToggleGroupItem
                value="iperarousalScore"
                size="sm"
                className="flex-1"
              >
                Iperarousal
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {renderGraph()}
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
}
