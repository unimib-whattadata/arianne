'use client';

import { AlignLeft, List, LoaderCircle, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { Shimmer } from '@/components/ui/schimmer';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { FormValues } from '@/features/questionnaires/asi-3/item';
import { QUESTIONS } from '@/features/questionnaires/asi-3/questions';
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
import { cn } from '@/utils/cn';

const RESPONSES_DICT = {
  0: 'Molto poco',
  1: 'Poco',
  2: 'Un poco',
  3: 'Molto',
  4: 'Moltissimo',
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

  const physicalFearScore = [3, 4, 6, 8, 9, 10, 11, 14];
  const lossOfControlFearScore = [2, 12, 15, 16];
  const socialFearScore = [1, 5, 7, 13];

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

  const lossOfControlFearScoreQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return lossOfControlFearScore.includes(+id);
    })
    .map(([key, value], index) => ({
      id: lossOfControlFearScore[index],
      text: QUESTIONS[lossOfControlFearScore[index] - 1].text,

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

  const physicalFearScoreQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return physicalFearScore.includes(+id);
    })
    .map(([key, value], index) => ({
      id: physicalFearScore[index],
      text: QUESTIONS[physicalFearScore[index] - 1].text,
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

  const socialFearScoreQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return socialFearScore.includes(+id);
    })
    .map(([key, value], index) => ({
      id: socialFearScore[index],
      text: QUESTIONS[socialFearScore[index] - 1].text,
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

  const lossOfControlFearScoreData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return lossOfControlFearScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  const physicalFearScoreData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1]);
      return physicalFearScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  const socialFearScoreData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return socialFearScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  const renderDotGraph = () => {
    let data: DotGraphDataComparison;
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

    return (
      <DotGraph
        T={[prevAdministration.T, nextAdministration.T]}
        domain={[0, 4]}
        data={data}
      />
    );
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
    <AdministrationContentCompare
      isLoading={isLoading}
      type="asi-3"
      administrations={[prevAdministration, nextAdministration]}
      title="Anxiety Sensitivity Index-3 (ASI-3)"
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
                label="Punteggio Totale"
                score={[
                  prevScore.lossOfControlFearScore +
                    prevScore.physicalFearScore +
                    prevScore.socialFearScore,
                  nextScore.lossOfControlFearScore +
                    nextScore.physicalFearScore +
                    nextScore.socialFearScore,
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
                label="Timore Sensazioni fisiche"
                score={[
                  prevScore.physicalFearScore,
                  nextScore.physicalFearScore,
                ]}
                baseText="Timore Sensazioni fisiche"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
              />
              <ScoreCard
                label="Timore Perdita Controllo"
                score={[
                  prevScore.lossOfControlFearScore,
                  nextScore.lossOfControlFearScore,
                ]}
                baseText="Timore Perdita Controllo"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
              />

              <ScoreCard
                label="Timore di ostracismo sociale"
                score={[prevScore.socialFearScore, nextScore.socialFearScore]}
                baseText="Timore di ostracismo sociale"
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
                  maxScore={64}
                  label="Punteggio Totale"
                  scores={[
                    {
                      score:
                        prevScore.lossOfControlFearScore +
                        prevScore.physicalFearScore +
                        prevScore.socialFearScore,
                      T: prevAdministration.T,
                    },
                    {
                      score:
                        nextScore.lossOfControlFearScore +
                        nextScore.physicalFearScore +
                        nextScore.socialFearScore,
                      T: nextAdministration.T,
                    },
                  ]}
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
                  scores={[
                    {
                      score: prevScore.physicalFearScore,
                      T: prevAdministration.T,
                    },
                    {
                      score: nextScore.physicalFearScore,
                      T: nextAdministration.T,
                    },
                  ]}
                  ticks={[]}
                />
              </div>

              <div className="pt-2">
                <LineGraph
                  maxScore={16}
                  label=" Timore Perdita Controllo"
                  scores={[
                    {
                      score: prevScore.lossOfControlFearScore,
                      T: prevAdministration.T,
                    },
                    {
                      score: nextScore.lossOfControlFearScore,
                      T: nextAdministration.T,
                    },
                  ]}
                  ticks={[]}
                />
              </div>

              <div className="pt-2">
                <LineGraph
                  maxScore={16}
                  label="Timore di ostracismo sociale"
                  scores={[
                    {
                      score: prevScore.socialFearScore,
                      T: prevAdministration.T,
                    },
                    {
                      score: nextScore.socialFearScore,
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
    </AdministrationContentCompare>
  );
}
