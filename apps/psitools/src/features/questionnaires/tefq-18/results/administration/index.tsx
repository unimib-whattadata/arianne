'use client';

import { AlignLeft, List, LoaderCircle, ScatterChart } from 'lucide-react';
import { useState } from 'react';

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
import type { FormValues } from '@/features/questionnaires/tefq-18/item';
import { QUESTIONS } from '@/features/questionnaires/tefq-18/questions';

const RESPONSES_DICT = {
  1: 'Completamente falso',
  2: 'Prevalentemente falso',
  3: 'Prevalentemente vero',
  4: 'Completamente vero',
} as const;

type TValue = keyof typeof RESPONSES_DICT;

export default function AdministrationResultsTefq18Page() {
  const [toggleValue, setToggleValue] = useState('dots');
  const [toggleGraph, setToggleGraph] = useState<string>('chart');
  const [scale, setScale] = useState<string>('global');

  const { administration, isLoading } = useAdministration<FormValues>();

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

  const { response, score } = administration.records;

  if (!response || !score) return null;

  //Question Items

  const UE_IDS = [1, 4, 5, 7, 8, 9, 13, 14, 17];
  const CR_IDS = [2, 11, 12, 15, 1, 18];
  const EE_IDS = [3, 6, 10];

  const getResponseText = (questionId: number, value: number) => {
    const question = QUESTIONS.find((q) => q.id === questionId);
    if (!question) return null;

    if (question.options && question.options.length > 0) {
      return question.options[value - 1] || 'Risposta non valida';
    } else {
      return RESPONSES_DICT[value as TValue] || 'Risposta non valida';
    }
  };

  const globalQuestions = Object.entries(response).map(([_, value], index) => ({
    id: index + 1,
    text: QUESTIONS[index].text,
    value: getResponseText(index + 1, +value),
  })) satisfies ItemsListQuestions;

  const filterQuestionsByIds = (ids: number[]) => {
    return globalQuestions.filter((q) => ids.includes(q.id));
  };

  const questionsUE = filterQuestionsByIds(UE_IDS) satisfies ItemsListQuestions;
  const questionsCR = filterQuestionsByIds(CR_IDS) satisfies ItemsListQuestions;
  const questionsEE = filterQuestionsByIds(EE_IDS) satisfies ItemsListQuestions;

  //Dot Graph

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

  const UEData = filterDataByIds(response, UE_IDS);
  const CRData = filterDataByIds(response, CR_IDS);
  const EEData = filterDataByIds(response, EE_IDS);

  //Graphs Funcions

  const renderDotGraph = () => {
    let data: DotGraphDataSingle;
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
            T={administration.T ?? 0}
            domain={[1, 4]}
            data={other}
            containerId="container1"
          />
          <DotGraph
            T={administration.T ?? 0}
            domain={[1, 8]}
            data={item18}
            containerId="container2"
            axis={5}
            height={150}
          />
        </div>
      );
    }
    return <DotGraph T={administration.T ?? 0} domain={[1, 4]} data={data} />;
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
      <div className="m-w-5xl">
        <ItemsList questions={q} />
      </div>
    );
  };

  const renderGraph = () => {
    if (toggleValue === 'dots') return renderDotGraph();
    return renderItemsList();
  };

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="tefq-18"
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
            <div className="flex">
              <ScoreCard
                label="Scala globale"
                score={score.UE + score.CR + score.EE}
              />
              <Separator orientation="vertical" className="w-1px mt-7 h-28" />

              <ScoreCard label="Uncontrolled Eating" score={score.UE} />
              <ScoreCard label="Cognitive Restraint" score={score.CR} />
              <ScoreCard label="Emotional Eating" score={score.EE} />
            </div>
          ) : (
            <>
              <LineGraph
                maxScore={76}
                label="Scala globale"
                scores={score.UE + score.CR + score.EE}
                ticks={[]}
              />
              <Separator
                orientation="horizontal"
                className="h-1px mb-4 mt-16 w-full"
              />
              <LineGraph
                maxScore={36}
                label="Uncontrolled Eating"
                scores={score.UE}
                ticks={[]}
              />
              <div className="pt-2">
                <LineGraph
                  maxScore={28}
                  label="Cognitive Restraint"
                  scores={score.CR}
                  ticks={[]}
                />
                <LineGraph
                  maxScore={12}
                  label="Emotional Eating"
                  scores={score.EE}
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
    </AdministrationContent>
  );
}
