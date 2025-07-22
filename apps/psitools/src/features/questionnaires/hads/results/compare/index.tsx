'use client';

import { AlignLeft, List, LoaderCircle, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/sckeleton';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  AdministrationContentCompare,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/questionnaires/components/administration';
import type { DotGraphDataComparison } from '@/features/questionnaires/components/dot-graph';
import { DotGraph } from '@/features/questionnaires/components/dot-graph';
import type { ItemsListQuestions } from '@/features/questionnaires/components/items-list';
import { ItemsList } from '@/features/questionnaires/components/items-list';
import { LineGraph } from '@/features/questionnaires/components/line-graph';
import { ScoreCard } from '@/features/questionnaires/components/score-card';
import type { FormValues } from '@/features/questionnaires/hads/item';
import { QUESTIONS } from '@/features/questionnaires/hads/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import { cn } from '@/utils/cn';

//Value creation

const Value = ({
  currentValue,
  otherValue,
  questionId,
}: {
  currentValue: string;
  otherValue: string;
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
          'flex rounded-md px-2 font-semibold',
          isWorse && 'bg-red-200 text-red-500',
        )}
      >
        {currentValue}
      </span>
    </div>
  );
};
export default function AdministrationResultsHadsPage() {
  const [toggleValue, setToggleValue] = useState('dots');
  const [toggleGraph, setToggleGraph] = useState<string>('chart');
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

  const prevRecords = prevAdministration?.records;
  const nextRecords = nextAdministration?.records;

  const prevResponse = prevRecords.response;
  const nextResponse = nextRecords.response;

  const prevScore = prevRecords.score;
  const nextScore = nextRecords.score;

  if (
    prevResponse === undefined ||
    prevScore === undefined ||
    nextResponse === undefined ||
    nextScore === undefined
  )
    return null;

  //Question IDS

  const anxietyIds = [1, 3, 5, 7, 9, 11, 13];
  const depressionIds = [2, 4, 6, 8, 10, 12, 14];

  //Item list questions

  const globalQuestions = Object.entries(prevResponse).map(
    ([key, value], index) => {
      const question = QUESTIONS[index];
      const reversePrevValue = question.reverse ? 3 - +value : +value;
      const reverseNextValue = question.reverse
        ? 3 - +nextResponse[key]
        : +nextResponse[key];

      return {
        id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: {
          prev: (
            <Value
              currentValue={question.options[reversePrevValue]}
              otherValue={question.options[reverseNextValue]}
              questionId={question.id}
            />
          ),
          next: (
            <Value
              currentValue={question.options[reverseNextValue]}
              otherValue={question.options[reversePrevValue]}
              questionId={question.id}
            />
          ),
        },
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

  //Dot Graph Data Creation

  const globalData = Object.entries(prevResponse).map(([key, value]) => ({
    index: key.split('-')[1],
    next: +nextResponse[key],
    prev: +value,
  })) satisfies DotGraphDataComparison;

  const filterDataByIds = (
    prevResponse: Record<string, string>,
    ids: number[],
  ) => {
    return Object.entries(prevResponse)
      .filter(([key]) => {
        const indexNumber = parseInt(key.split('-')[1], 10);
        return ids.includes(indexNumber);
      })
      .map(([key, value]) => ({
        index: key.split('-')[1],
        next: +nextResponse[key],
        prev: +value,
      })) satisfies DotGraphDataComparison;
  };

  const anxietyData = filterDataByIds(prevResponse, anxietyIds);
  const depressionData = filterDataByIds(prevResponse, depressionIds);

  //Render functions

  const renderDotGraph = () => {
    let data: DotGraphDataComparison;
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

    return (
      <DotGraph
        T={[prevAdministration.T, nextAdministration.T]}
        domain={[0, 3]}
        data={data}
      />
    );
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

    return (
      <ItemsList
        questions={q}
        T={[prevAdministration.T, nextAdministration.T]}
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
      type="hads"
      administrations={[prevAdministration, nextAdministration]}
      title="Hospital anxiety and depression scale (HADS)"
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
            <div className="flex min-w-[670px] gap-2">
              <ScoreCard
                label="Distress generale"
                score={[
                  prevScore.anxiety + prevScore.depression,
                  nextScore.anxiety + nextScore.depression,
                ]}
                baseText="Distress generale"
                comparisonText={{
                  positive: 'peggiorato',
                  negative: 'migliorato',
                  indifferent: 'invariato',
                }}
              />
              <Separator orientation="vertical" className="w-1px mt-7 h-28" />
              <ScoreCard
                label="Ansia"
                score={[prevScore.anxiety, nextScore.anxiety]}
                baseText="Ansia"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
              />
              <ScoreCard
                label="Depressione"
                score={[prevScore.depression, nextScore.depression]}
                baseText="Depressione"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
              />
            </div>
          ) : (
            <>
              <div className="pb-2">
                <LineGraph
                  maxScore={42}
                  label="Distress generale"
                  scores={[
                    {
                      score: prevScore.anxiety + prevScore.depression,
                      T: prevAdministration.T,
                    },
                    {
                      score: nextScore.anxiety + nextScore.depression,
                      T: nextAdministration.T,
                    },
                  ]}
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
                className="h-1px mt-10 w-full"
              />

              <div className="pt-2">
                <LineGraph
                  maxScore={21}
                  label=" Ansia"
                  scores={[
                    { score: prevScore.anxiety, T: prevAdministration.T },
                    { score: nextScore.anxiety, T: nextAdministration.T },
                  ]}
                  ticks={[]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={21}
                  label="Depressione"
                  scores={[
                    { score: prevScore.depression, T: prevAdministration.T },
                    { score: nextScore.depression, T: nextAdministration.T },
                  ]}
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
    </AdministrationContentCompare>
  );
}
