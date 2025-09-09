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
import type { FormValues } from '@/features/questionnaires/hads/item';
import { QUESTIONS } from '@/features/questionnaires/hads/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

const Value = ({ value }: { value: string }) => {
  return <span>{value}</span>;
};

export default function AdministrationResultsHadsPage() {
  const [toggleValue, setToggleValue] = useState('dots');
  const [toggleGraph, setToggleGraph] = useState<string>('chart');
  const [scale, setScale] = useState<string>('global');

  const { administration, isLoading } = useAdministration<FormValues>();

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

  const { response, score } = administration.records;

  if (!response || !score) return null;

  //Question IDS

  const anxietyIds = [1, 3, 5, 7, 9, 11, 13];
  const depressionIds = [2, 4, 6, 8, 10, 12, 14];

  //Questions creation

  const globalQuestions = Object.entries(response).map(
    ([key, value], index) => {
      const question = QUESTIONS[index];
      const reverseValue = question.reverse
        ? 3 - parseInt(value)
        : parseInt(value);

      return {
        id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: <Value value={question.options[reverseValue]} />,
      };
    },
  ) satisfies ItemsListQuestions;

  const filterQuestionsByIds = (ids: number[]) => {
    return globalQuestions.filter((q) => ids.includes(parseInt(q.id)));
  };

  const anxietyQuestions = filterQuestionsByIds(
    anxietyIds,
  ) satisfies ItemsListQuestions;
  const depressionQuestions = filterQuestionsByIds(
    depressionIds,
  ) satisfies ItemsListQuestions;

  //Dot Graph Data creation

  const globalData = Object.entries(response).map(([key, value]) => ({
    index: key.split('-')[1],
    value: +value,
  })) satisfies DotGraphDataSingle;

  const filterDataByIds = (response: Record<string, string>, ids: number[]) => {
    return Object.entries(response)
      .filter(([key]) => {
        const indexNumber = parseInt(key.split('-')[1], 10);
        return ids.includes(indexNumber);
      })
      .map(([key, value]) => ({
        index: key.split('-')[1],
        value: Number(value),
      })) satisfies DotGraphDataSingle;
  };

  const anxietyData = filterDataByIds(response, anxietyIds);
  const depressionData = filterDataByIds(response, depressionIds);

  const renderDotGraph = () => {
    let data: DotGraphDataSingle;
    switch (scale) {
      case 'anxiety':
        data = anxietyData;
        break;
      case 'depression':
        data = depressionData;
        break;
      default:
        data = globalData;
    }

    return <DotGraph T={administration.T ?? 0} domain={[0, 3]} data={data} />;
  };

  const renderItemsList = () => {
    let q: ItemsListQuestions;
    switch (scale) {
      case 'anxiety':
        q = anxietyQuestions;
        break;
      case 'depression':
        q = depressionQuestions;
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
      type="hads"
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
            <span className="block">Cut-off = 16</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {toggleGraph === 'chart' ? (
            <div className="flex min-w-[670px]">
              <ScoreCard
                score={score.anxiety + score.depression}
                label="Distress generale"
                cutoff={16}
              />
              <Separator orientation="vertical" className="w-1px mt-7 h-28" />
              <ScoreCard score={score.anxiety} label="Ansia" />
              <ScoreCard score={score.depression} label="Depressione" />
            </div>
          ) : (
            <>
              <div className="pb-2">
                <LineGraph
                  maxScore={42}
                  label="Distress generale"
                  scores={score.anxiety + score.depression}
                  ticks={[
                    {
                      cutoff: 16,
                      label: 'Cut-off <br> Moderata',
                      color: 'warning',
                    },
                    { cutoff: 22, label: 'Grave', color: 'danger' },
                  ]}
                />
              </div>

              <Separator
                orientation="horizontal"
                className="h-1px mt-7 w-full"
              />

              <div className="pt-2">
                <LineGraph
                  maxScore={21}
                  label=" Ansia"
                  scores={score.anxiety}
                  ticks={[]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={21}
                  label="Depressione"
                  scores={score.depression}
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
                Distress generale
              </ToggleGroupItem>
              <ToggleGroupItem value="anxiety" size="sm" className="flex-1">
                Ansia
              </ToggleGroupItem>
              <ToggleGroupItem value="depression" size="sm" className="flex-1">
                Depressione
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {renderGraph()}
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
}
