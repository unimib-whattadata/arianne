'use client';

import { AlignLeft, List, LoaderCircle, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { CardDescription } from '@/components/ui/card';
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
import type { FormValues } from '@/features/questionnaires/mogs/item';
import { QUESTIONS } from '@/features/questionnaires/mogs/questions';
import { cn } from '@/utils/cn';

const RESPONSES_DICT = {
  1: 'Per nulla',
  2: 'Poco',
  3: 'Abbastanza',
  4: 'Molto',
  5: 'Moltissimo',
} as const;

type TValue = keyof typeof RESPONSES_DICT;

const MNV_QUESTIONS = [5, 6, 7, 9, 14, 15];
const EMP_QUESTIONS = [2, 10, 13, 16, 17];
const MODI_QUESTIONS = [1, 8, 12];
const HARM_QUESTIONS = [3, 4, 11];

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

  const mnvQuestions = Object.entries(prevResponse)
    .filter(([,], index) => MNV_QUESTIONS.includes(index))
    .map(([key, value], index) => ({
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
    })) satisfies ItemsListQuestions;

  const empathyQuestions = Object.entries(prevResponse)
    .filter(([,], index) => EMP_QUESTIONS.includes(index))
    .map(([key, value], index) => ({
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
    })) satisfies ItemsListQuestions;
  const modiQuestions = Object.entries(prevResponse)
    .filter(([,], index) => MODI_QUESTIONS.includes(index))
    .map(([key, value], index) => ({
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
    })) satisfies ItemsListQuestions;
  const harmQuestions = Object.entries(prevResponse)
    .filter(([,], index) => HARM_QUESTIONS.includes(index))
    .map(([key, value], index) => ({
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
    })) satisfies ItemsListQuestions;

  const globalData = Object.entries(prevResponse).map(([key, value]) => ({
    index: key.split('-')[1],
    next: +nextResponse[key],
    prev: +value,
  })) satisfies DotGraphDataComparison;

  const mnvData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return MNV_QUESTIONS.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  const empathyData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return EMP_QUESTIONS.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;
  const modiData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return MODI_QUESTIONS.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;
  const harmData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return HARM_QUESTIONS.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  const renderDotGraph = () => {
    let data: DotGraphDataComparison;
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
    <AdministrationContentCompare
      isLoading={isLoading}
      type="mogs"
      administrations={[prevAdministration, nextAdministration]}
      title="Intolerance of Uncertainty Scale-Revised (mogs)"
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
            <div className="flex min-w-[670px] gap-2">
              <ScoreCard
                label="MNV"
                score={[
                  prevScore.MNV +
                    prevScore.EMP +
                    prevScore.MODI +
                    prevScore.HARM,
                  nextScore.MNV +
                    nextScore.EMP +
                    nextScore.MODI +
                    nextScore.HARM,
                ]}
                baseText="Scala globale"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
              />
              <Separator orientation="vertical" className="w-1px mt-7 h-28" />
              <ScoreCard
                label="MNV"
                score={[prevScore.MNV, nextScore.MNV]}
                baseText="MNV"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
              />
              <ScoreCard
                label="Empathy"
                score={[prevScore.EMP, nextScore.EMP]}
                baseText="Empathy"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
              />
              <ScoreCard
                label="MODI"
                score={[prevScore.MODI, nextScore.MODI]}
                baseText="MODI"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
              />
              <ScoreCard
                label="Harm"
                score={[prevScore.HARM, nextScore.HARM]}
                baseText="Harm"
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
                  label="Scala globale"
                  scores={[
                    {
                      score:
                        prevScore.MNV +
                        prevScore.EMP +
                        prevScore.MODI +
                        prevScore.HARM,
                      T: prevAdministration.T,
                    },
                    {
                      score:
                        nextScore.MNV +
                        nextScore.EMP +
                        nextScore.MODI +
                        nextScore.HARM,
                      T: nextAdministration.T,
                    },
                  ]}
                  ticks={[{ cutoff: 17, label: 'Punteggio minimo' }]}
                />
              </div>
              <Separator
                orientation="horizontal"
                className="h-1px mt-7 w-full"
              />

              <div className="pt-2">
                <LineGraph
                  maxScore={35}
                  label="MNV"
                  scores={[
                    { score: prevScore.MNV, T: prevAdministration.T },
                    { score: nextScore.MNV, T: nextAdministration.T },
                  ]}
                  ticks={[{ cutoff: 6, label: 'Punteggio minimo' }]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={35}
                  label="Empathy"
                  scores={[
                    { score: prevScore.EMP, T: prevAdministration.T },
                    { score: nextScore.EMP, T: nextAdministration.T },
                  ]}
                  ticks={[{ cutoff: 6, label: 'Punteggio minimo' }]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={35}
                  label="MODI"
                  scores={[
                    { score: prevScore.MODI, T: prevAdministration.T },
                    { score: nextScore.MODI, T: nextAdministration.T },
                  ]}
                  ticks={[{ cutoff: 6, label: 'Punteggio minimo' }]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={35}
                  label="Harm"
                  scores={[
                    { score: prevScore.HARM, T: prevAdministration.T },
                    { score: nextScore.HARM, T: nextAdministration.T },
                  ]}
                  ticks={[{ cutoff: 6, label: 'Punteggio minimo' }]}
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
    </AdministrationContentCompare>
  );
}
