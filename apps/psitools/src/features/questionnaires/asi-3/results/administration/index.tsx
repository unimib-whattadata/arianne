'use client';

import { AlignLeft, List, LoaderCircle, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/sckeleton';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { FormValues } from '@/features/questionnaires/asi-3/item';
import { QUESTIONS } from '@/features/questionnaires/asi-3/questions';
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

const RESPONSES_DICT = {
  0: 'Molto poco',
  1: 'Poco',
  2: 'Un poco',
  3: 'Molto',
  4: 'Moltissimo',
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

  const physicalFearScore = [3, 4, 6, 8, 9, 10, 11, 14];
  const lossOfControlFearScore = [2, 12, 15, 16];
  const socialFearScore = [1, 5, 7, 13];

  const globalQuestions = Object.entries(response).map(([_, value], index) => {
    return {
      id: index + 1,
      text: QUESTIONS[index].text,
      value: <Value value={+value as TValue} />,
    };
  }) satisfies ItemsListQuestions;

  const lossOfControlFearScoreQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return lossOfControlFearScore.includes(+id);
    })
    .map(([_, value], index) => ({
      id: lossOfControlFearScore[index],
      text: QUESTIONS[lossOfControlFearScore[index] - 1].text,
      value: <Value value={+value as TValue} />,
    })) satisfies ItemsListQuestions;

  const physicalFearScoreQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return physicalFearScore.includes(+id);
    })
    .map(([_, value], index) => ({
      id: physicalFearScore[index],
      text: QUESTIONS[physicalFearScore[index] - 1].text,
      value: <Value value={+value as TValue} />,
    })) satisfies ItemsListQuestions;

  const socialFearScoreQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return socialFearScore.includes(+id);
    })
    .map(([_, value], index) => ({
      id: socialFearScore[index],
      text: QUESTIONS[socialFearScore[index] - 1].text,
      value: <Value value={+value as TValue} />,
    })) satisfies ItemsListQuestions;

  const globalData = Object.entries(response).map(([key, value]) => ({
    index: key.split('-')[1],
    value: +value,
  })) satisfies DotGraphDataSingle;

  const lossOfControlFearScoreData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return lossOfControlFearScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  const physicalFearScoreData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1]);
      return physicalFearScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  const socialFearScoreData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return socialFearScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  const renderDotGraph = () => {
    let data: DotGraphDataSingle;
    switch (scale) {
      case 'lossOfControlFearScore':
        data = lossOfControlFearScoreData;
        break;
      case 'physicalFearScore':
        data = physicalFearScoreData;
        break;
      case 'socialFearScore':
        data = socialFearScoreData;
        break;
      default:
        data = globalData;
    }

    return <DotGraph T={administration.T ?? 0} domain={[0, 4]} data={data} />;
  };

  const renderItemsList = () => {
    let q: ItemsListQuestions;
    switch (scale) {
      case 'lossOfControlFearScore':
        q = lossOfControlFearScoreQuestions;
        break;
      case 'physicalFearScore':
        q = physicalFearScoreQuestions;
        break;
      case 'socialFearScore':
        q = socialFearScoreQuestions;
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
      type="asi-3"
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
        </CardHeader>

        <CardContent>
          {toggleGraph === 'chart' ? (
            <div className="flex min-w-[670px]">
              <ScoreCard
                score={
                  score.lossOfControlFearScore +
                  score.physicalFearScore +
                  score.socialFearScore
                }
                label="Punteggio Totale"
              />
              <Separator orientation="vertical" className="w-1px mt-7 h-28" />
              <ScoreCard
                score={score.physicalFearScore}
                label="Timore Sensazioni fisiche"
              />
              <ScoreCard
                score={score.lossOfControlFearScore}
                label="Timore Perdita Controllo"
              />

              <ScoreCard
                score={score.socialFearScore}
                label="Timore di ostracismo sociale"
              />
            </div>
          ) : (
            <>
              <div className="pb-2">
                <LineGraph
                  maxScore={64}
                  label="Punteggio Totale"
                  scores={
                    score.lossOfControlFearScore +
                    score.physicalFearScore +
                    score.socialFearScore
                  }
                  ticks={[]}
                />
              </div>

              <Separator
                orientation="horizontal"
                className="h-1px mt-7 w-full"
              />
              <div className="pt-2">
                <LineGraph
                  maxScore={32}
                  label="Timore Sensazioni fisiche"
                  scores={score.physicalFearScore}
                  ticks={[]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={16}
                  label="Timore Perdita Controllo"
                  scores={score.lossOfControlFearScore}
                  ticks={[]}
                />
              </div>

              <div className="pt-2">
                <LineGraph
                  maxScore={16}
                  label="Timore di ostracismo sociale"
                  scores={score.socialFearScore}
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
                value="physicalFearScore"
                size="sm"
                className="flex-1"
              >
                Timore Sensazioni fisiche
              </ToggleGroupItem>
              <ToggleGroupItem
                value="lossOfControlFearScore"
                size="sm"
                className="flex-1"
              >
                Timore Perdita Controllo
              </ToggleGroupItem>

              <ToggleGroupItem
                value="socialFearScore"
                size="sm"
                className="flex-1"
              >
                Timore di ostracismo sociale
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {renderGraph()}
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
}
