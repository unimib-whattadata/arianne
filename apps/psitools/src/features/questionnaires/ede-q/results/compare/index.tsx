'use client';

import { List, ScatterChart } from 'lucide-react';
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
import { QUESTIONS } from '@/features/questionnaires/ede-q/questions';
import type { FormValues } from '@/features/questionnaires/ede-q/schema';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import { cn } from '@/utils/cn';

const RESPONSES_DICT_1 = {
  0: 'Mai',
  1: '1-5 giorni',
  2: '6-12 giorni',
  3: '13-15 giorni',
  4: '16-22 giorni',
  5: '23-27 giorni',
  6: 'Ogni giorno',
} as const;

const RESPONSES_DICT_2 = {
  0: 'Per niente',
  1: 'Per niente/Leggermente',
  2: 'Leggermente',
  3: 'Leggermente/Moderatamente',
  4: 'Moderatmente',
  5: 'Moderatamente/Notevolmente',
  6: 'Notevolmente',
} as const;

type TValue = keyof typeof RESPONSES_DICT_1;

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
  const question = QUESTIONS.find((q) => q.index === questionId);
  let responseText = 'Risposta non valida';

  if (question) {
    if (questionId >= 1 && questionId <= 12) {
      responseText = RESPONSES_DICT_1[currentValue] || 'Risposta non valida';
    } else if (questionId >= 13 && questionId <= 18) {
      responseText =
        typeof currentValue === 'string'
          ? currentValue
          : `Valore non valido: ${currentValue}`;
    } else if (questionId === 19 || questionId === 20) {
      if (question.options && question.options.length > 0) {
        const optionIndex = Number(currentValue);
        responseText = question.options[optionIndex] || 'Risposta non valida';
      } else {
        responseText = 'Opzioni non disponibili';
      }
    } else if (questionId >= 21 && questionId <= 28) {
      responseText = RESPONSES_DICT_2[currentValue] || 'Risposta non valida';
    } else {
      responseText = 'ID domanda non gestito';
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

export default function AdministrationResultsEdeQPage() {
  const [toggleValue, setToggleValue] = useState('dots');
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

  // Calcolo score totali

  const prevScore = parseInt(
    Object.entries(prevResponse.items).reduce((acc, [_, value]) => [
      acc[0],
      `${parseInt(acc[1]) + parseInt(value)}`,
    ])[1],
  );
  const nextScore = parseInt(
    Object.entries(nextResponse.items).reduce((acc, [_, value]) => [
      acc[0],
      `${parseInt(acc[1]) + parseInt(value)}`,
    ])[1],
  );

  if (
    prevResponse === undefined ||
    prevScore === undefined ||
    nextResponse === undefined ||
    nextScore === undefined
  )
    return null;

  //Question Items

  const R_IDS = [1, 2, 3, 4, 5];
  const PA_IDS = [7, 9, 19, 20, 21];
  const PFC_IDS = [6, 8, 10, 11, 23, 26, 27, 28];
  const PP_IDS = [8, 12, 22, 24, 25];

  // Funzione calcolo

  const calculateGroupScore = (ids: number[], items: Record<string, string>) =>
    ids.reduce((sum, id) => {
      const value = items[`item-${id}`];
      return sum + (parseInt(value) || 0);
    }, 0);

  // Prev score

  const RprevScore = calculateGroupScore(R_IDS, prevResponse.items);
  const PAprevScore = calculateGroupScore(PA_IDS, prevResponse.items);
  const PFCprevScore = calculateGroupScore(PFC_IDS, prevResponse.items);
  const PPprevScore = calculateGroupScore(PP_IDS, prevResponse.items);

  // Next score

  const RnextScore = calculateGroupScore(R_IDS, nextResponse.items);
  const PAnextScore = calculateGroupScore(PA_IDS, nextResponse.items);
  const PFCnextScore = calculateGroupScore(PFC_IDS, nextResponse.items);
  const PPnextScore = calculateGroupScore(PP_IDS, prevResponse.items);

  //PrevT data

  const globalQuestions = Object.entries(prevResponse.items).map(
    ([key, value]) => {
      const questionId = parseInt(key.split('-')[1], 10);
      const prevValue = +value;
      const nextValue = +nextResponse.items[key];

      return {
        id: questionId,
        text:
          QUESTIONS.find((q) => q.index === questionId)?.text ||
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
    },
  ) satisfies ItemsListQuestions;

  const filterQuestionsByIds = (ids: number[]) => {
    return globalQuestions.filter((q) => ids.includes(q.id));
  };

  const questionsR = filterQuestionsByIds(R_IDS) satisfies ItemsListQuestions;
  const questionsPA = filterQuestionsByIds(PA_IDS) satisfies ItemsListQuestions;
  const questionsPFC = filterQuestionsByIds(
    PFC_IDS,
  ) satisfies ItemsListQuestions;
  const questionsPP = filterQuestionsByIds(PP_IDS) satisfies ItemsListQuestions;

  const questionOpenText = [
    { id: 13, text: QUESTIONS[12].text },
    { id: 14, text: QUESTIONS[13].text },
    { id: 15, text: QUESTIONS[14].text },
    { id: 16, text: QUESTIONS[15].text },
    { id: 17, text: QUESTIONS[16].text },
    { id: 18, text: QUESTIONS[17].text },
  ];

  const questionsOpen = questionOpenText
    .filter(
      (question) =>
        question.id === 13 ||
        question.id === 14 ||
        question.id === 15 ||
        question.id === 16 ||
        question.id === 17 ||
        question.id === 18,
    )
    .map((question) => ({
      ...question,
      value: {
        prev:
          prevResponse.notes[`note-${question.id}`] ||
          'Nessuna risposta fornita',
        next:
          nextResponse.notes[`note-${question.id}`] ||
          'Nessuna risposta fornita',
      },
    }));

  const globalData = Object.entries(prevResponse.items).map(([key, value]) => ({
    index: key.split('-')[1],
    next: +nextResponse.items[key],
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
        next: +nextResponse.items[key],
        prev: +value,
      })) satisfies DotGraphDataComparison;
  };
  const RData = filterDataByIds(prevResponse.items, R_IDS);

  const PAData = filterDataByIds(prevResponse.items, PA_IDS);
  const PFCData = filterDataByIds(prevResponse.items, PFC_IDS);
  const PPData = filterDataByIds(prevResponse.items, PP_IDS);

  const renderDotGraph = () => {
    let data: DotGraphDataComparison;
    let height: number;

    switch (scale) {
      case 'R':
        data = RData;
        height = 500;
        break;
      case 'PA':
        data = PAData;
        height = 500;
        break;
      case 'PFC':
        data = PFCData;
        height = 500;
        break;
      case 'PP':
        data = PPData;
        height = 500;
        break;
      default:
        data = globalData;
        height = 1000;
    }

    return (
      <DotGraph
        T={[prevAdministration.T, nextAdministration.T]}
        domain={[0, 6]}
        data={data}
        height={height}
        axis={5}
      />
    );
  };

  const renderItemsList = () => {
    let q: ItemsListQuestions;
    switch (scale) {
      case 'R':
        q = questionsR;
        break;
      case 'PA':
        q = questionsPA;
        break;
      case 'PFC':
        q = questionsPFC;
        break;
      case 'PP':
        q = questionsPP;
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

  const roundToTwoDecimals = (num: number) => {
    return parseFloat(num.toFixed(2));
  };

  // Calcolo Medie
  const RAvg = roundToTwoDecimals(RprevScore / R_IDS.length);
  const PAAvg = roundToTwoDecimals(PAprevScore / PA_IDS.length);
  const PFCAvg = roundToTwoDecimals(PFCprevScore / PFC_IDS.length);
  const PPAvg = roundToTwoDecimals(PPprevScore / PP_IDS.length);

  const RAvgNext = roundToTwoDecimals(RnextScore / R_IDS.length);
  const PAAvgNext = roundToTwoDecimals(PAnextScore / PA_IDS.length);
  const PFCAvgNext = roundToTwoDecimals(PFCnextScore / PFC_IDS.length);
  const PPAvgNext = roundToTwoDecimals(PPnextScore / PP_IDS.length);

  const globalAvg = roundToTwoDecimals((RAvg + PAAvg + PFCAvg + PPAvg) / 4);
  const globalAvgNext = roundToTwoDecimals(
    (RAvgNext + PAAvgNext + PFCAvgNext + PPAvgNext) / 4,
  );

  return (
    <AdministrationContentCompare
      isLoading={isLoading}
      type="ede-q"
      administrations={[prevAdministration, nextAdministration]}
      title="Eating Disorder Examination Questionnaire (EDE-Q)"
    >
      <div className="flex gap-2 text-center">
        <Card>
          <div className="h-full w-[250px]">
            <ScoreCard
              label="Restrizione"
              score={[RAvg, RAvgNext]}
              baseText="Restrizione"
              comparisonText={{
                positive: 'I sintomi sono peggiorati',
                negative: 'I sintomi sono migliorati',
                indifferent: 'I sintomi sono rimasti invariati',
              }}
              className="flex h-full justify-between"
            ></ScoreCard>
          </div>
        </Card>
        <Card>
          <div className="w-[250px]">
            <ScoreCard
              label="Preoccupazione per l'alimentazione"
              score={[PAAvg, PAAvgNext]}
              baseText="Preoccupazione per l'alimentazione"
              comparisonText={{
                positive: 'I sintomi sono peggiorati',
                negative: 'I sintomi sono migliorati',
                indifferent: 'I sintomi sono rimasti invariati',
              }}
            ></ScoreCard>
          </div>
        </Card>
        <Card>
          <div className="w-[250px]">
            <ScoreCard
              label="Preoccupazione per la forma del corpo"
              score={[PFCAvg, PFCAvgNext]}
              baseText="Preoccupazione per la forma del corpo"
              comparisonText={{
                positive: 'I sintomi sono peggiorati',
                negative: 'I sintomi sono migliorati',
                indifferent: 'I sintomi sono rimasti invariati',
              }}
            ></ScoreCard>
          </div>
        </Card>
        <Card>
          <div className="w-[250px]">
            <ScoreCard
              label="Preoccupazione per il peso"
              score={[PPAvg, PPAvgNext]}
              baseText="Preoccupazione per il peso"
              comparisonText={{
                positive: 'I sintomi sono peggiorati',
                negative: 'I sintomi sono migliorati',
                indifferent: 'I sintomi sono rimasti invariati',
              }}
            ></ScoreCard>
          </div>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="pb-2">
            <LineGraph
              maxScore={6}
              label="Scala globale"
              scores={[
                {
                  score: globalAvg,
                  T: prevAdministration.T,
                },
                {
                  score: globalAvgNext,
                  T: nextAdministration.T,
                },
              ]}
              ticks={[]}
            />
          </div>
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
              className="mb-4 flex w-full gap-0 rounded-md bg-input leading-tight"
            >
              <ToggleGroupItem value="global" size="sm" className="flex-1">
                Scala globale
              </ToggleGroupItem>
              <ToggleGroupItem value="R" size="sm" className="flex-1">
                Restrizione
              </ToggleGroupItem>
              <ToggleGroupItem
                value="PA"
                size="sm"
                className="flex-1 leading-tight"
              >
                Preoccupazione per l’alimentazione
              </ToggleGroupItem>
              <ToggleGroupItem
                value="PFC"
                size="sm"
                className="flex-1 leading-tight"
              >
                Preoccupazione per la forma corporea
              </ToggleGroupItem>
              <ToggleGroupItem
                value="PP"
                size="sm"
                className="flex-1 leading-tight"
              >
                Preoccupazione per il peso
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {renderGraph()}
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-md">
            Item con risposta aperta (da 13 a 18)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            <ItemsList
              questions={questionsOpen}
              T={[prevAdministration.T, nextAdministration.T]}
            />
          </div>
        </CardContent>
      </Card>
    </AdministrationContentCompare>
  );
}
