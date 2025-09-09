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
import type { FormValues } from '@/features/questionnaires/ius-r/item';
import { QUESTIONS } from '@/features/questionnaires/ius-r/questions';

const RESPONSES_DICT = {
  1: 'Per nulla',
  2: 'Un poco',
  3: 'Abbastanza',
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

  const globalQuestions = Object.entries(response).map(([_, value], index) => ({
    id: index + 1,
    text: QUESTIONS[index].text,
    value: <Value value={+value as TValue} />,
  })) satisfies ItemsListQuestions;

  const prospectiveQuestions = Object.entries(response)
    .filter(([,], index) => index >= 0 && index < 7)
    .map(([_, value], index) => ({
      id: index + 1,
      text: QUESTIONS[index].text,
      value: <Value value={+value as TValue} />,
    })) satisfies ItemsListQuestions;

  const inhibitoryQuestions = Object.entries(response)
    .filter(([,], index) => index >= 7 && index < 12)
    .map(([_, value], index) => ({
      id: index + 8,
      text: QUESTIONS[index + 7].text,
      value: <Value value={+value as TValue} />,
    })) satisfies ItemsListQuestions;

  const globalData = Object.entries(response).map(([key, value]) => ({
    index: key.split('-')[1],
    value: +value,
  })) satisfies DotGraphDataSingle;

  const prospectiveData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return indexNumber >= 1 && indexNumber <= 7;
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  const inhibitoryData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return indexNumber > 7 && indexNumber <= 12;
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  const renderDotGraph = () => {
    let data: DotGraphDataSingle;
    switch (scale) {
      case 'prospective':
        data = prospectiveData;
        break;
      case 'inhibitory':
        data = inhibitoryData;
        break;
      default:
        data = globalData;
    }

    return <DotGraph T={administration.T ?? 0} domain={[1, 5]} data={data} />;
  };

  const renderItemsList = () => {
    let q: ItemsListQuestions;
    switch (scale) {
      case 'prospective':
        q = prospectiveQuestions;
        break;
      case 'inhibitory':
        q = inhibitoryQuestions;
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
      type="ius-r"
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
          <CardDescription>
            <span className="block">M = 26.73</span>
            <span className="block">DS = 8.20</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {toggleGraph === 'chart' ? (
            <div className="flex min-w-[670px]">
              <ScoreCard
                score={score.inhibitory + score.prospective}
                label="Scala globale"
              />
              <Separator orientation="vertical" className="w-1px mt-7 h-28" />
              <ScoreCard score={score.prospective} label="IU Prospettica" />
              <ScoreCard score={score.inhibitory} label="IU Inibitoria" />
            </div>
          ) : (
            <>
              <div className="pb-2">
                <LineGraph
                  maxScore={60}
                  label="Scala globale"
                  scores={score.inhibitory + score.prospective}
                  ticks={[
                    { cutoff: 26.73 - 8.2 * 2, label: '-2&sigma;' },
                    { cutoff: 26.73 - 8.2, label: '-1&sigma;' },
                    { cutoff: 26.73, label: 'Media' },
                    {
                      cutoff: 26.73 + 8.2,
                      label: '1&sigma;',
                      color: 'warning',
                    },
                    {
                      cutoff: 26.73 + 8.2 * 2,
                      label: '2&sigma;',
                      color: 'danger',
                    },
                  ]}
                />
              </div>

              <Separator
                orientation="horizontal"
                className="h-1px mt-7 w-full"
              />

              <div className="pt-2">
                <LineGraph
                  maxScore={35}
                  label=" IU Prospettica"
                  scores={score.prospective}
                  ticks={[]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={25}
                  label="IU Inibitoria"
                  scores={score.inhibitory}
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
                Scala globale
              </ToggleGroupItem>
              <ToggleGroupItem value="prospective" size="sm" className="flex-1">
                IU Prospettica
              </ToggleGroupItem>
              <ToggleGroupItem value="inhibitory" size="sm" className="flex-1">
                IU Inibitoria
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {renderGraph()}
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
}
