'use client';

import { AlignLeft, List, LoaderCircle, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { Shimmer } from '@/components/ui/schimmer';
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
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/ptsq/item';
import { QUESTIONS } from '@/features/questionnaires/ptsq/questions';
import { cn } from '@/utils/cn';

const RESPONSES_DICT = {
  1: 'Per nulla',
  2: 'Poco',
  3: 'Un poco',
  4: 'Molto',
  5: 'Moltissimo',
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

export default function AdministrationResultsIusRPage() {
  const [toggleValue, setToggleValue] = useState('dots');
  const [toggleGraph, setToggleGraph] = useState<string>('chart');
  const [scale, setScale] = useState<string>('global');

  const { administration, isLoading } = useAdministration<FormValues>({
    isComparison: true,
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

  const intrusivenesScore = [1, 2, 3, 4];
  const avoidanceScore = [5, 6, 7, 8];
  const iperarousalScore = [9, 10, 11, 12];

  //PrevT data

  const globalQuestions = Object.entries(prevResponse).map(
    ([key, value], index) => ({
      id: index + 1,
      text: QUESTIONS[index].text,
      value: {
        prev: (
          <Value
            currentValue={+value as TValue}
            otherValue={+nextResponse[key] as TValue}
          />
        ),
        next: (
          <Value
            currentValue={+nextResponse[key] as TValue}
            otherValue={+value as TValue}
          />
        ),
      },
    }),
  ) satisfies ItemsListQuestions;

  const avoidanceScoreQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return avoidanceScore.includes(+id);
    })
    .map(([key, value], index) => ({
      id: avoidanceScore[index],
      text: QUESTIONS[avoidanceScore[index] - 1].text,

      value: {
        prev: (
          <Value
            currentValue={+value as TValue}
            otherValue={+nextResponse[key] as TValue}
          />
        ),
        next: (
          <Value
            currentValue={+nextResponse[key] as TValue}
            otherValue={+value as TValue}
          />
        ),
      },
    })) satisfies ItemsListQuestions;

  const intrusivenesScoreQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return intrusivenesScore.includes(+id);
    })
    .map(([key, value], index) => ({
      id: intrusivenesScore[index],
      text: QUESTIONS[intrusivenesScore[index] - 1].text,
      value: {
        prev: (
          <Value
            currentValue={+value as TValue}
            otherValue={+nextResponse[key] as TValue}
          />
        ),
        next: (
          <Value
            currentValue={+nextResponse[key] as TValue}
            otherValue={+value as TValue}
          />
        ),
      },
    })) satisfies ItemsListQuestions;

  const iperarousalScoreQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return iperarousalScore.includes(+id);
    })
    .map(([key, value], index) => ({
      id: iperarousalScore[index],
      text: QUESTIONS[iperarousalScore[index] - 1].text,
      value: {
        prev: (
          <Value
            currentValue={+value as TValue}
            otherValue={+nextResponse[key] as TValue}
          />
        ),
        next: (
          <Value
            currentValue={+nextResponse[key] as TValue}
            otherValue={+value as TValue}
          />
        ),
      },
    })) satisfies ItemsListQuestions;

  const globalData = Object.entries(prevResponse).map(([key, value]) => ({
    index: key.split('-')[1],
    next: +nextResponse[key],
    prev: +value,
  })) satisfies DotGraphDataComparison;

  const avoidanceScoreData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return avoidanceScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  const intrusivenesScoreData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1]);
      return intrusivenesScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  const iperarousalScoreData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return iperarousalScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  const renderDotGraph = () => {
    let data: DotGraphDataComparison;
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
    return (
      <DotGraph
        T={[prevAdministration.T, nextAdministration.T]}
        domain={[1, 5]}
        data={data}
      />
    );
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
    <AdministrationContentCompare
      isLoading={isLoading}
      type="ptsq"
      administrations={[prevAdministration, nextAdministration]}
      title="Post-Traumatic Symptom Questionnaire (PTSQ)"
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
            <div className="flex min-w-[670px] gap-2">
              <ScoreCard
                label="scala globale"
                score={[
                  prevScore.avoidanceScore +
                    prevScore.intrusivenesScore +
                    prevScore.iperarousalScore,
                  nextScore.avoidanceScore +
                    nextScore.intrusivenesScore +
                    nextScore.iperarousalScore,
                ]}
                baseText="Punteggio Totale"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
              />
              <Separator orientation="vertical" className="w-1px mt-7 h-28" />
              <ScoreCard
                label="Intrusività"
                score={[
                  prevScore.intrusivenesScore,
                  nextScore.intrusivenesScore,
                ]}
                baseText="Intrusività"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
              />
              <ScoreCard
                label="Evitamento"
                score={[prevScore.avoidanceScore, nextScore.avoidanceScore]}
                baseText="Evitamento"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
              />

              <ScoreCard
                label="Iperarousal"
                score={[prevScore.iperarousalScore, nextScore.iperarousalScore]}
                baseText="Iperarousal"
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
                  maxScore={60}
                  label="Punteggio Totale"
                  scores={[
                    {
                      score:
                        prevScore.avoidanceScore +
                        prevScore.intrusivenesScore +
                        prevScore.iperarousalScore,
                      T: prevAdministration.T,
                    },
                    {
                      score:
                        nextScore.avoidanceScore +
                        nextScore.intrusivenesScore +
                        nextScore.iperarousalScore,
                      T: nextAdministration.T,
                    },
                  ]}
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
                  scores={[
                    {
                      score: prevScore.intrusivenesScore,
                      T: prevAdministration.T,
                    },
                    {
                      score: nextScore.intrusivenesScore,
                      T: nextAdministration.T,
                    },
                  ]}
                  ticks={[]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={20}
                  label=" Evitamento"
                  scores={[
                    {
                      score: prevScore.avoidanceScore,
                      T: prevAdministration.T,
                    },
                    {
                      score: nextScore.avoidanceScore,
                      T: nextAdministration.T,
                    },
                  ]}
                  ticks={[]}
                />
              </div>

              <div className="pt-2">
                <LineGraph
                  maxScore={20}
                  label="Iperarousal"
                  scores={[
                    {
                      score: prevScore.iperarousalScore,
                      T: prevAdministration.T,
                    },
                    {
                      score: nextScore.iperarousalScore,
                      T: nextAdministration.T,
                    },
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
    </AdministrationContentCompare>
  );
}
