'use client';

import { List, ScatterChart } from 'lucide-react';
import type { NextPage } from 'next';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/sckeleton';
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
import { QUESTIONS } from '@/features/questionnaires/ede-q/questions';
import type { FormValues } from '@/features/questionnaires/ede-q/schema';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

//Response dictionary domande 19 20

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
type TValue2 = keyof typeof RESPONSES_DICT_2;

const AdministrationResultsEdeQ: NextPage = () => {
  const [toggleValue, setToggleValue] = useState('dots');
  // const [toggleGraph, setToggleGraph] = useState<string>('chart');
  const [scale, setScale] = useState<string>('global');

  const { administration, isLoading } = useAdministration<FormValues>();

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

  const { response } = administration.records;

  const score = parseInt(
    Object.entries(response.items).reduce((acc, [_, value]) => [
      acc[0],
      `${parseInt(acc[1]) + parseInt(value)}`,
    ])[1],
  );

  if (!response || !score) return null;

  //Divisione in Items

  const R_IDS = [1, 2, 3, 4, 5];
  const PA_IDS = [7, 9, 19, 20, 21];
  const PFC_IDS = [6, 8, 10, 11, 23, 26, 27, 28];
  const PP_IDS = [8, 12, 22, 24, 25];

  // Funzione calcolo score di un gruppo
  const calculateGroupScore = (ids: number[], items: Record<string, string>) =>
    ids.reduce((sum, id) => {
      const value = items[`item-${id}`];
      return sum + (parseInt(value) || 0);
    }, 0);

  const RScore = calculateGroupScore(R_IDS, response.items);
  const PAScore = calculateGroupScore(PA_IDS, response.items);
  const PFCScore = calculateGroupScore(PFC_IDS, response.items);
  const PPScore = calculateGroupScore(PP_IDS, response.items);

  //Visualizzazione testi

  const getResponseText = (questionId: number, value: number | string) => {
    const question = QUESTIONS.find((q) => q.index === questionId);
    if (!question) return 'Domanda non trovata';

    if (questionId >= 1 && questionId <= 12) {
      return RESPONSES_DICT_1[value as TValue] || 'Risposta non valida';
    } else if (questionId >= 13 && questionId <= 18) {
      return typeof value === 'string' ? value : `Valore non valido: ${value}`;
    } else if (questionId === 19 || questionId === 20) {
      if (question.options && question.options.length > 0) {
        const optionIndex = Number(value);
        return question.options[optionIndex] || 'Risposta non valida';
      } else {
        return 'Opzioni non disponibili';
      }
    } else if (questionId >= 21 && questionId <= 28) {
      return RESPONSES_DICT_2[value as TValue2] || 'Risposta non valida';
    } else {
      return 'ID domanda non gestito';
    }
  };

  const globalQuestions = Object.entries(response.items).map(
    ([key, value], _) => {
      const questionIndex = parseInt(key.split('-')[1], 10) - 1;
      const question = QUESTIONS[questionIndex];
      return {
        id: questionIndex + 1,
        text: question?.text || `Domanda ${questionIndex + 1} non trovata`,
        value: getResponseText(questionIndex + 1, +value),
      };
    },
  ) satisfies ItemsListQuestions;

  const filterQuestionsByIds = (ids: number[]) => {
    return globalQuestions.filter((q) => ids.includes(q.id));
  };

  //Filtro domande

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
      value:
        response.notes[`note-${question.id}`] || 'Nessuna risposta fornita',
    }));

  // Dot Graph

  const globalData = Object.entries(response.items).map(([key, value]) => ({
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

  //Filtro dot graph

  const RData = filterDataByIds(response.items, R_IDS);
  const PAData = filterDataByIds(response.items, PA_IDS);
  const PFCData = filterDataByIds(response.items, PFC_IDS);
  const PPData = filterDataByIds(response.items, PP_IDS);

  // Graphs Functions
  const renderDotGraph = () => {
    let data: DotGraphDataSingle;
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
        T={administration.T ?? 0}
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
      <div className="m-w-5xl">
        <ItemsList questions={q} />
      </div>
    );
  };

  const renderGraph = () => {
    if (toggleValue === 'dots') return renderDotGraph();
    return renderItemsList();
  };

  // Formula deviazione standard

  const calculateStandardDeviation = (values: number[]): number => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;
    return Math.sqrt(variance);
  };

  const filterValuesByIds = (
    response: Record<string, string>,
    ids: number[],
  ) => {
    return Object.entries(response)
      .filter(([key]) => {
        const indexNumber = parseInt(key.split('-')[1], 10);
        return ids.includes(indexNumber);
      })
      .map(([_, value]) => Number(value));
  };

  // Riduzione deciali
  const roundToTwoDecimals = (num: number) => {
    return parseFloat(num.toFixed(2));
  };

  // Calcolo Medie
  const RAvg = roundToTwoDecimals(RScore / R_IDS.length);
  const PAAvg = roundToTwoDecimals(PAScore / PA_IDS.length);
  const PFCAvg = roundToTwoDecimals(PFCScore / PFC_IDS.length);
  const PPAvg = roundToTwoDecimals(PPScore / PP_IDS.length);

  const globalAvg = roundToTwoDecimals((RAvg + PAAvg + PFCAvg + PPAvg) / 4);

  // Filtro valori per calcolo
  const RValues = filterValuesByIds(response.items, R_IDS);
  const PAValues = filterValuesByIds(response.items, PA_IDS);
  const PFCValues = filterValuesByIds(response.items, PFC_IDS);
  const PPValues = filterValuesByIds(response.items, PP_IDS);

  // Calcolo deviazione standard
  const RSD = roundToTwoDecimals(calculateStandardDeviation(RValues));
  const PASD = roundToTwoDecimals(calculateStandardDeviation(PAValues));
  const PFCSD = roundToTwoDecimals(calculateStandardDeviation(PFCValues));
  const PPSD = roundToTwoDecimals(calculateStandardDeviation(PPValues));

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="ede-q"
      date={administration.date}
      T={administration.T}
    >
      <div className="flex gap-2 text-center">
        <Card>
          <div className="h-full w-[250px]">
            <ScoreCard label="Restrizione" score={RAvg} className="h-full">
              <span> σ = {RSD}</span>
            </ScoreCard>
          </div>
        </Card>
        <Card>
          <div className="w-[250px]">
            <ScoreCard label="Preoccupazione per l'alimentazione" score={PAAvg}>
              <span> σ = {PASD}</span>{' '}
            </ScoreCard>
          </div>
        </Card>
        <Card>
          <div className="w-[250px]">
            <ScoreCard
              label="Preoccupazione per la forma del corpo"
              score={PFCAvg}
            >
              <span> σ = {PFCSD}</span>
            </ScoreCard>
          </div>
        </Card>
        <Card>
          <div className="w-[250px]">
            <ScoreCard label="Preoccupazione per il peso" score={PPAvg}>
              <span> σ ={PPSD}</span>
            </ScoreCard>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
          {/* <ToggleGroup
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
          </ToggleGroup> */}
        </CardHeader>

        <CardContent>
          <>
            <LineGraph
              maxScore={6}
              label="Media globale"
              scores={globalAvg}
              ticks={[]}
            />
          </>
          {/* {toggleGraph === 'chart' ? (
            <>
              <div className="flex ">
                <ScoreCard label="Media globale" score={globalAvg} />
                <Separator orientation="vertical" className="w-1px mt-7 h-28" />

                <ScoreCard label="Media R" score={RAvg} />

                <ScoreCard label="Media PA" score={PAAvg} />
                <ScoreCard label="Media PFC" score={PFCAvg} />
                <ScoreCard label="Media PP" score={PPAvg} />
              </div>
              <div className="flex gap-10">
                <div>{RSD}</div>
                <div>{PASD}</div>
                <div>{PFCSD}</div>
                <div>{PPSD}</div>
              </div>
            </>
          ) : (
            <>
              <LineGraph
                maxScore={6}
                label="Media globale"
                scores={globalAvg}
                ticks={[]}
              />
            </>
          )} */}
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
              <ToggleGroupItem
                value="global"
                size="sm"
                className="flex-1 leading-tight"
              >
                Scala globale
              </ToggleGroupItem>
              <ToggleGroupItem
                value="R"
                size="sm"
                className="flex-1 leading-tight"
              >
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
          <div className="pb-2 text-sm">
            <ItemsList questions={questionsOpen}></ItemsList>
          </div>
        </CardContent>
      </Card>
    </AdministrationContent>
  );
};

export default AdministrationResultsEdeQ;
