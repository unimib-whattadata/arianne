'use client';

import { AlignLeft, List, LoaderCircle, ScatterChart } from 'lucide-react';
import { useState } from 'react';

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
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/tefq-18/item';
import { QUESTIONS } from '@/features/questionnaires/tefq-18/questions';
import { cn } from '@/utils/cn';

const RESPONSES_DICT = {
  1: 'Completamente falso',
  2: 'Prevalentemente falso',
  3: 'Prevalentemente vero',
  4: 'Completamente vero',
} as const;

type TValue = keyof typeof RESPONSES_DICT;

const Value = ({
  questionId,
  currentValue,
  otherValue,
}: {
  questionId: number;
  currentValue: TValue;
  otherValue: TValue;
}) => {
  const isWorse = currentValue > otherValue;

  // Ottieni il testo della risposta
  const question = QUESTIONS.find((q) => q.id === questionId);
  let responseText = 'Risposta non valida';

  if (question) {
    if (question.options && question.options.length > 0) {
      responseText =
        question.options[currentValue - 1] || 'Risposta non valida';
    } else {
      responseText = RESPONSES_DICT[currentValue] || 'Risposta non valida';
    }
  }

  return (
    <div className="flex h-full space-x-2">
      <Separator className="h-full w-px bg-slate-300" />
      <span>
        <p
          className={cn(
            'flex rounded-full px-2 font-semibold',
            isWorse && 'bg-red-200 text-red-500',
          )}
        >
          {responseText}
        </p>
      </span>
    </div>
  );
};

export default function AdministrationResultsTefq18Page() {
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

  //Question Items

  const UE_IDS = [1, 4, 5, 7, 8, 9, 13, 14, 17];
  const CR_IDS = [2, 11, 12, 15, 1, 18];
  const EE_IDS = [3, 6, 10];

  //PrevT data

  const globalQuestions = Object.entries(prevResponse).map(([key, value]) => {
    const questionId = parseInt(key.split('-')[1], 10);
    const prevValue = +value;
    const nextValue = +nextResponse[key];

    return {
      id: questionId,
      text:
        QUESTIONS.find((q) => q.id === questionId)?.text ||
        'Domanda sconosciuta',
      value: {
        prev: (
          <Value
            questionId={questionId}
            currentValue={prevValue as TValue}
            otherValue={nextValue as TValue}
          />
        ),
        next: (
          <Value
            questionId={questionId}
            currentValue={nextValue as TValue}
            otherValue={prevValue as TValue}
          />
        ),
      },
    };
  }) satisfies ItemsListQuestions;

  const filterQuestionsByIds = (ids: number[]) => {
    return globalQuestions.filter((q) => ids.includes(q.id));
  };

  const questionsUE = filterQuestionsByIds(UE_IDS) satisfies ItemsListQuestions;
  const questionsCR = filterQuestionsByIds(CR_IDS) satisfies ItemsListQuestions;
  const questionsEE = filterQuestionsByIds(EE_IDS) satisfies ItemsListQuestions;

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

  const UEData = filterDataByIds(prevResponse, UE_IDS);
  const CRData = filterDataByIds(prevResponse, CR_IDS);
  const EEData = filterDataByIds(prevResponse, EE_IDS);

  const renderDotGraph = () => {
    let data: DotGraphDataComparison;
    switch (scale) {
      case 'UE':
        data = UEData;
        break;
      case 'CR':
        data = CRData;
        break;
      case 'EE':
        data = EEData;
        break;
      default:
        data = globalData;
    }

    const item18 = data.filter((item) => item.index === '18');
    const other = data.filter((item) => item.index !== '18');

    if (item18.length > 0) {
      return (
        <div className="grid gap-4">
          <DotGraph
            T={[prevAdministration.T, nextAdministration.T]}
            domain={[1, 4]}
            data={other}
            containerId="container1"
          />
          <DotGraph
            T={[prevAdministration.T, nextAdministration.T]}
            domain={[1, 8]}
            data={item18}
            containerId="container2"
            axis={5}
            height={150}
          />
        </div>
      );
    }

    return (
      <DotGraph
        T={[prevAdministration.T, nextAdministration.T]}
        domain={[1, 4]}
        data={data}
      />
    );
  };

  const renderItemsList = () => {
    let q: ItemsListQuestions;
    switch (scale) {
      case 'UE':
        q = questionsUE;
        break;
      case 'CR':
        q = questionsCR;
        break;
      case 'EE':
        q = questionsEE;
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
      type="tefq-18"
      administrations={[prevAdministration, nextAdministration]}
      title="Three Factor Eating Questionnaire-18R (TEFQ-18)"
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
            <div className="flex">
              <ScoreCard
                label="Scala globale"
                score={[
                  prevScore.UE + prevScore.CR + prevScore.EE,
                  nextScore.UE + nextScore.CR + nextScore.EE,
                ]}
                baseText="Punteggio globale"
                comparisonText={{
                  positive: '',
                  negative: '',
                  indifferent: '',
                }}
              />
              <Separator orientation="vertical" className="w-1px mt-7 h-28" />

              <ScoreCard
                label="Uncontrolled Eating"
                score={[prevScore.UE, nextScore.UE]}
                baseText="Uncontrolled Eating"
                comparisonText={{
                  positive: '',
                  negative: '',
                  indifferent: '',
                }}
              />

              <ScoreCard
                label="Cognitive Restraint"
                score={[prevScore.CR, nextScore.CR]}
                baseText="Cognitive Restraint"
                comparisonText={{
                  positive: '',
                  negative: '',
                  indifferent: '',
                }}
              />

              <ScoreCard
                label="Emotional Eating"
                score={[prevScore.EE, nextScore.EE]}
                baseText="Emotional Eating"
                comparisonText={{
                  positive: '',
                  negative: '',
                  indifferent: '',
                }}
              />
            </div>
          ) : (
            <>
              <div className="pb-2">
                <LineGraph
                  maxScore={76}
                  label="Scala globale"
                  scores={[
                    {
                      score: prevScore.UE + prevScore.CR + prevScore.EE,
                      T: prevAdministration.T,
                    },
                    {
                      score: nextScore.UE + nextScore.CR + nextScore.EE,
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
                  maxScore={36}
                  label="Uncontrolled Eating
"
                  scores={[
                    { score: prevScore.UE, T: prevAdministration.T },
                    { score: nextScore.UE, T: nextAdministration.T },
                  ]}
                  ticks={[]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={28}
                  label="Cognitive Restraint"
                  scores={[
                    { score: prevScore.CR, T: prevAdministration.T },
                    { score: nextScore.CR, T: nextAdministration.T },
                  ]}
                  ticks={[]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={12}
                  label="Emotional Eating"
                  scores={[
                    { score: prevScore.EE, T: prevAdministration.T },
                    { score: nextScore.EE, T: nextAdministration.T },
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
                Scala globale
              </ToggleGroupItem>
              <ToggleGroupItem value="UE" size="sm" className="flex-1">
                Uncontrolled Eating{' '}
              </ToggleGroupItem>
              <ToggleGroupItem value="CR" size="sm" className="flex-1">
                Cognitive Restraint{' '}
              </ToggleGroupItem>
              <ToggleGroupItem value="EE" size="sm" className="flex-1">
                Emotional Eating
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {renderGraph()}
        </CardFooter>
      </Card>
    </AdministrationContentCompare>
  );
}
