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
import type { FormValues } from '@/features/questionnaires/core-om/item';
import { QUESTIONS } from '@/features/questionnaires/core-om/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import { cn } from '@/utils/cn';

const RESPONSES_DICT = {
  0: 'Per nulla',
  1: 'Solo Occasionalmente',
  2: 'Ogni Tanto',
  3: 'Spesso',
  4: 'Molto Spesso o sempre',
} as const;

type TValue = keyof typeof RESPONSES_DICT;

const Value = ({
  currentValue,
  otherValue,
  questionId,
}: {
  currentValue: TValue;
  otherValue: TValue;
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

  const { administration, isLoading, sex } = useAdministration<FormValues>({
    isComparison: true,
    hasSex: true,
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

  const subjectiveScore = [4, 14, 17, 31];

  //START Symptom general score
  const symptomsAnxietyScore = [2, 11, 15, 20];
  const symptomsDepressionScore = [5, 23, 27, 30];
  const symptomsPhysicalScore = [8, 18];
  const symptomsTraumaScore = [13, 28];
  const symptomsScore = [
    ...symptomsAnxietyScore,
    ...symptomsDepressionScore,
    ...symptomsPhysicalScore,
    ...symptomsTraumaScore,
  ];
  //END Symptom general score

  // START Operation General Score
  const operationGeneralScore = [7, 12, 21, 32];
  const operationIntimateScore = [1, 3, 19, 26];
  const operationSocialScore = [10, 25, 29, 33];
  const operationScore = [
    ...operationGeneralScore,
    ...operationIntimateScore,
    ...operationSocialScore,
  ];
  // END  Operation General Score

  //START Risk general core

  const riskharmingSelfScore = [9, 34, 16, 24];
  const riskheterolesiveScore = [6, 22];
  const riskScore = [...riskharmingSelfScore, ...riskheterolesiveScore];
  //END Risk general core

  const globalQuestions = Object.entries(prevResponse).map(([key, value]) => {
    const question = QUESTIONS.find(
      (q) => q.id === parseInt(key.split('-')[1], 10),
    );

    if (!question) {
      throw new Error('Question not found');
    }
    const reversePrevValue = question.reverse ? 4 - +value : +value;
    const reverseNextValue = question.reverse
      ? 4 - +nextResponse[key]
      : +nextResponse[key];

    return {
      id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
      text: question.text,
      value: {
        prev: (
          <Value
            currentValue={reversePrevValue as TValue}
            otherValue={reverseNextValue as TValue}
            questionId={question.id}
          />
        ),
        next: (
          <Value
            currentValue={reverseNextValue as TValue}
            otherValue={reversePrevValue as TValue}
            questionId={question.id}
          />
        ),
      },
    };
  }) satisfies ItemsListQuestions;

  const subjectiveScoreQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return subjectiveScore.includes(+id);
    })
    .map(([key, value]) => {
      const question = QUESTIONS.find(
        (q) => q.id === parseInt(key.split('-')[1], 10),
      );

      if (!question) {
        throw new Error('Question not found');
      }
      const reversePrevValue = question.reverse ? 4 - +value : +value;
      const reverseNextValue = question.reverse
        ? 4 - +nextResponse[key]
        : +nextResponse[key];

      return {
        id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: {
          prev: (
            <Value
              currentValue={reversePrevValue as TValue}
              otherValue={reverseNextValue as TValue}
              questionId={question.id}
            />
          ),
          next: (
            <Value
              currentValue={reverseNextValue as TValue}
              otherValue={reversePrevValue as TValue}
              questionId={question.id}
            />
          ),
        },
      };
    }) satisfies ItemsListQuestions;
  //START symptom Questions

  const symptomsAnxietyQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return symptomsAnxietyScore.includes(+id);
    })
    .map(([key, value]) => {
      const question = QUESTIONS.find(
        (q) => q.id === parseInt(key.split('-')[1], 10),
      );

      if (!question) {
        throw new Error('Question not found');
      }
      const reversePrevValue = question.reverse ? 4 - +value : +value;
      const reverseNextValue = question.reverse
        ? 4 - +nextResponse[key]
        : +nextResponse[key];

      return {
        id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: {
          prev: (
            <Value
              currentValue={reversePrevValue as TValue}
              otherValue={reverseNextValue as TValue}
              questionId={question.id}
            />
          ),
          next: (
            <Value
              currentValue={reverseNextValue as TValue}
              otherValue={reversePrevValue as TValue}
              questionId={question.id}
            />
          ),
        },
      };
    }) satisfies ItemsListQuestions;

  const symptomsDepressionQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return symptomsDepressionScore.includes(+id);
    })
    .map(([key, value]) => {
      const question = QUESTIONS.find(
        (q) => q.id === parseInt(key.split('-')[1], 10),
      );

      if (!question) {
        throw new Error('Question not found');
      }
      const reversePrevValue = question.reverse ? 4 - +value : +value;
      const reverseNextValue = question.reverse
        ? 4 - +nextResponse[key]
        : +nextResponse[key];

      return {
        id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: {
          prev: (
            <Value
              currentValue={reversePrevValue as TValue}
              otherValue={reverseNextValue as TValue}
              questionId={question.id}
            />
          ),
          next: (
            <Value
              currentValue={reverseNextValue as TValue}
              otherValue={reversePrevValue as TValue}
              questionId={question.id}
            />
          ),
        },
      };
    }) satisfies ItemsListQuestions;

  const symptomsPhysicalQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return symptomsPhysicalScore.includes(+id);
    })
    .map(([key, value]) => {
      const question = QUESTIONS.find(
        (q) => q.id === parseInt(key.split('-')[1], 10),
      );

      if (!question) {
        throw new Error('Question not found');
      }
      const reversePrevValue = question.reverse ? 4 - +value : +value;
      const reverseNextValue = question.reverse
        ? 4 - +nextResponse[key]
        : +nextResponse[key];

      return {
        id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: {
          prev: (
            <Value
              currentValue={reversePrevValue as TValue}
              otherValue={reverseNextValue as TValue}
              questionId={question.id}
            />
          ),
          next: (
            <Value
              currentValue={reverseNextValue as TValue}
              otherValue={reversePrevValue as TValue}
              questionId={question.id}
            />
          ),
        },
      };
    }) satisfies ItemsListQuestions;

  const symptomsTraumaQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return symptomsTraumaScore.includes(+id);
    })
    .map(([key, value]) => {
      const question = QUESTIONS.find(
        (q) => q.id === parseInt(key.split('-')[1], 10),
      );

      if (!question) {
        throw new Error('Question not found');
      }
      const reversePrevValue = question.reverse ? 4 - +value : +value;
      const reverseNextValue = question.reverse
        ? 4 - +nextResponse[key]
        : +nextResponse[key];

      return {
        id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: {
          prev: (
            <Value
              currentValue={reversePrevValue as TValue}
              otherValue={reverseNextValue as TValue}
              questionId={question.id}
            />
          ),
          next: (
            <Value
              currentValue={reverseNextValue as TValue}
              otherValue={reversePrevValue as TValue}
              questionId={question.id}
            />
          ),
        },
      };
    }) satisfies ItemsListQuestions;

  //END symptom Questions

  //START Operation Questions

  const operationGeneralQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return operationGeneralScore.includes(+id);
    })
    .map(([key, value]) => {
      const question = QUESTIONS.find(
        (q) => q.id === parseInt(key.split('-')[1], 10),
      );

      if (!question) {
        throw new Error('Question not found');
      }
      const reversePrevValue = question.reverse ? 4 - +value : +value;
      const reverseNextValue = question.reverse
        ? 4 - +nextResponse[key]
        : +nextResponse[key];

      return {
        id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: {
          prev: (
            <Value
              currentValue={reversePrevValue as TValue}
              otherValue={reverseNextValue as TValue}
              questionId={question.id}
            />
          ),
          next: (
            <Value
              currentValue={reverseNextValue as TValue}
              otherValue={reversePrevValue as TValue}
              questionId={question.id}
            />
          ),
        },
      };
    }) satisfies ItemsListQuestions;

  const operationIntimateQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return operationIntimateScore.includes(+id);
    })
    .map(([key, value]) => {
      const question = QUESTIONS.find(
        (q) => q.id === parseInt(key.split('-')[1], 10),
      );

      if (!question) {
        throw new Error('Question not found');
      }
      const reversePrevValue = question.reverse ? 4 - +value : +value;
      const reverseNextValue = question.reverse
        ? 4 - +nextResponse[key]
        : +nextResponse[key];

      return {
        id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: {
          prev: (
            <Value
              currentValue={reversePrevValue as TValue}
              otherValue={reverseNextValue as TValue}
              questionId={question.id}
            />
          ),
          next: (
            <Value
              currentValue={reverseNextValue as TValue}
              otherValue={reversePrevValue as TValue}
              questionId={question.id}
            />
          ),
        },
      };
    }) satisfies ItemsListQuestions;

  const operationSocialQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return operationSocialScore.includes(+id);
    })
    .map(([key, value]) => {
      const question = QUESTIONS.find(
        (q) => q.id === parseInt(key.split('-')[1], 10),
      );

      if (!question) {
        throw new Error('Question not found');
      }
      const reversePrevValue = question.reverse ? 4 - +value : +value;
      const reverseNextValue = question.reverse
        ? 4 - +nextResponse[key]
        : +nextResponse[key];

      return {
        id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: {
          prev: (
            <Value
              currentValue={reversePrevValue as TValue}
              otherValue={reverseNextValue as TValue}
              questionId={question.id}
            />
          ),
          next: (
            <Value
              currentValue={reverseNextValue as TValue}
              otherValue={reversePrevValue as TValue}
              questionId={question.id}
            />
          ),
        },
      };
    }) satisfies ItemsListQuestions;

  //END Operation Questions
  //START Risk Questions

  const riskharmingSelfScoreQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return riskharmingSelfScore.includes(+id);
    })
    .map(([key, value]) => {
      const question = QUESTIONS.find(
        (q) => q.id === parseInt(key.split('-')[1], 10),
      );

      if (!question) {
        throw new Error('Question not found');
      }
      const reversePrevValue = question.reverse ? 4 - +value : +value;
      const reverseNextValue = question.reverse
        ? 4 - +nextResponse[key]
        : +nextResponse[key];

      return {
        id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: {
          prev: (
            <Value
              currentValue={reversePrevValue as TValue}
              otherValue={reverseNextValue as TValue}
              questionId={question.id}
            />
          ),
          next: (
            <Value
              currentValue={reverseNextValue as TValue}
              otherValue={reversePrevValue as TValue}
              questionId={question.id}
            />
          ),
        },
      };
    }) satisfies ItemsListQuestions;

  const riskheterolesiveScoreQuestions = Object.entries(prevResponse)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return riskheterolesiveScore.includes(+id);
    })
    .map(([key, value]) => {
      const question = QUESTIONS.find(
        (q) => q.id === parseInt(key.split('-')[1], 10),
      );

      if (!question) {
        throw new Error('Question not found');
      }
      const reversePrevValue = question.reverse ? 4 - +value : +value;
      const reverseNextValue = question.reverse
        ? 4 - +nextResponse[key]
        : +nextResponse[key];

      return {
        id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: {
          prev: (
            <Value
              currentValue={reversePrevValue as TValue}
              otherValue={reverseNextValue as TValue}
              questionId={question.id}
            />
          ),
          next: (
            <Value
              currentValue={reverseNextValue as TValue}
              otherValue={reversePrevValue as TValue}
              questionId={question.id}
            />
          ),
        },
      };
    }) satisfies ItemsListQuestions;

  //END Risk Questions

  const globalData = Object.entries(prevResponse).map(([key, value]) => ({
    index: key.split('-')[1],
    next: +nextResponse[key],
    prev: +value,
  })) satisfies DotGraphDataComparison;

  const subjectiveScoreData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1]);
      return subjectiveScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  const symptomsScoreData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return symptomsScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  const operationScoreData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return operationScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  const riskScoreData = Object.entries(prevResponse)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return riskScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      next: +nextResponse[key],
      prev: +value,
    })) satisfies DotGraphDataComparison;

  // const prevglobalScale =
  //   (prevScore.symptomsScore +
  //     prevScore.subjectiveScore +
  //     prevScore.operationScore +
  //     prevScore.riskScore) /
  //   5;

  // const nextglobalScale =
  //   (nextScore.symptomsScore +
  //     nextScore.subjectiveScore +
  //     nextScore.operationScore +
  //     nextScore.riskScore) /
  //   5;

  //Punteggio Totale
  const prevtotalResponsesScore =
    prevScore.symptomsScore * symptomsScore.length +
    prevScore.subjectiveScore * subjectiveScore.length +
    prevScore.operationScore * operationScore.length +
    prevScore.riskScore * riskScore.length;

  const nexttotalResponsesScore =
    nextScore.symptomsScore * symptomsScore.length +
    nextScore.subjectiveScore * subjectiveScore.length +
    nextScore.operationScore * operationScore.length +
    nextScore.riskScore * riskScore.length;

  //Punteggio Medio

  const prevTotaverage = prevtotalResponsesScore / 34;
  const nextTotaverage = nexttotalResponsesScore / 34;

  //Punteggio Non rischio

  const prevnonRiskScore =
    (prevtotalResponsesScore - prevScore.riskScore * riskScore.length) / 28;
  const nextnonRiskScore =
    (nexttotalResponsesScore - nextScore.riskScore * riskScore.length) / 28;

  const renderDotGraph = () => {
    let data: DotGraphDataComparison;
    switch (scale) {
      case 'subjectiveScore':
        data = subjectiveScoreData;
        break;
      case 'symptomsScore':
        data = symptomsScoreData;
        break;
      case 'operationScore':
        data = operationScoreData;
        break;

      case 'riskScore':
        data = riskScoreData;
        break;
      default:
        data = globalData;
    }
    let graphHeight;

    if (scale === 'subjectiveScore') {
      graphHeight = 230;
    } else if (scale === 'operationScore') {
      graphHeight = 550;
    } else if (scale === 'symptomsScore') {
      graphHeight = 550;
    } else if (scale === 'riskScore') {
      graphHeight = 300;
    } else {
      graphHeight = 1100;
    }
    return (
      <DotGraph
        T={[prevAdministration.T, nextAdministration.T]}
        domain={[0, 4]}
        data={data}
        height={graphHeight}
      />
    );
  };

  const renderItemsList = () => {
    let q: ItemsListQuestions;
    switch (scale) {
      case 'symptomsScore':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold">Sintomi/Ansia</h3>
              <ItemsList questions={symptomsAnxietyQuestions} />
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Sintomi/Depressione</h3>
              <ItemsList questions={symptomsDepressionQuestions} />
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Sintomi/Fisici</h3>
              <ItemsList questions={symptomsPhysicalQuestions} />
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Sintomi/Trauma</h3>
              <ItemsList questions={symptomsTraumaQuestions} />
            </div>
          </div>
        );
      case 'subjectiveScore':
        q = subjectiveScoreQuestions;
        break;
      case 'operationScore':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold">Funzionamento Generale</h3>
              <ItemsList questions={operationGeneralQuestions} />
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Relazioni Intime</h3>
              <ItemsList questions={operationIntimateQuestions} />
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Relazioni Sociali</h3>
              <ItemsList questions={operationSocialQuestions} />
            </div>
          </div>
        );
      case 'riskScore':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold">Rischio Autolesivo</h3>
              <ItemsList questions={riskharmingSelfScoreQuestions} />
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Rischio Eterolesivo</h3>
              <ItemsList questions={riskheterolesiveScoreQuestions} />
            </div>
          </div>
        );
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
      type="core-om"
      administrations={[prevAdministration, nextAdministration]}
      title="Clinical Outcomes in Routine Evaluation - Outcome Measure (CORE - OM)"
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
            <div className="relative grid grid-cols-[220px_220px_220px] place-items-stretch gap-4">
              <ScoreCard
                label="Punteggio Medio"
                score={[prevTotaverage, nextTotaverage]}
                baseText="Punteggio Medio Totale"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
                className="m-0 rounded-md bg-slate-100"
              />
              <ScoreCard
                label="Benesessere Soggettivo"
                score={[prevScore.subjectiveScore, nextScore.subjectiveScore]}
                baseText="Benesessere Soggettivo"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
                className="m-0 rounded-md border border-slate-100"
              />
              <ScoreCard
                label="Funzionamento"
                score={[prevScore.operationScore, nextScore.operationScore]}
                baseText="Funzionamento"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
                className="m-0 rounded-md border border-slate-100"
              />
              <ScoreCard
                label="Sintomi"
                score={[prevScore.symptomsScore, nextScore.symptomsScore]}
                baseText="Sintomi"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
                className="m-0 rounded-md border border-slate-100"
              />

              <ScoreCard
                label="Rischio"
                score={[prevScore.riskScore, nextScore.riskScore]}
                baseText="Rischio"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
                className="m-0 rounded-md border border-slate-100"
              />
              <ScoreCard
                label="Non Rischio"
                score={[prevnonRiskScore, nextnonRiskScore]}
                baseText="Non Rischio"
                comparisonText={{
                  positive: 'peggiorata',
                  negative: 'migliorata',
                  indifferent: 'invariata',
                }}
                className="m-0 rounded-md border border-slate-100"
              />
            </div>
          ) : (
            <>
              <div className="pb-2">
                <LineGraph
                  maxScore={16}
                  label="Punteggio Medio"
                  scores={[
                    {
                      score: parseFloat(prevTotaverage.toFixed(2)),
                      T: prevAdministration.T,
                    },
                    {
                      score: parseFloat(nextTotaverage.toFixed(2)),
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
                  maxScore={4}
                  label="Benessere soggettivo"
                  scores={[
                    {
                      score: parseFloat(prevScore.subjectiveScore.toFixed(2)),
                      T: prevAdministration.T,
                    },
                    {
                      score: parseFloat(nextScore.subjectiveScore.toFixed(2)),
                      T: nextAdministration.T,
                    },
                  ]}
                  ticks={[
                    {
                      cutoff: sex === 'M' ? 1.4 : 1.84,
                      label: 'Cut-off',
                      color: 'danger',
                    },
                  ]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={4}
                  label=" Funzionamento"
                  scores={[
                    {
                      score: parseFloat(prevScore.operationScore.toFixed(2)),
                      T: prevAdministration.T,
                    },
                    {
                      score: parseFloat(nextScore.operationScore.toFixed(2)),
                      T: nextAdministration.T,
                    },
                  ]}
                  ticks={[
                    {
                      cutoff: sex === 'M' ? 1.29 : 1.3,
                      label: 'Cut-off',
                      color: 'danger',
                    },
                  ]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={4}
                  label="Sintomi"
                  scores={[
                    {
                      score: parseFloat(prevScore.symptomsScore.toFixed(2)),
                      T: prevAdministration.T,
                    },
                    {
                      score: parseFloat(nextScore.symptomsScore.toFixed(2)),
                      T: nextAdministration.T,
                    },
                  ]}
                  ticks={[
                    {
                      cutoff: sex === 'M' ? 1.3 : 1.43,
                      label: 'Cut-off',
                      color: 'danger',
                    },
                  ]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={4}
                  label="Rischio"
                  scores={[
                    {
                      score: parseFloat(prevScore.riskScore.toFixed(2)),
                      T: prevAdministration.T,
                    },
                    {
                      score: parseFloat(nextScore.riskScore.toFixed(2)),
                      T: nextAdministration.T,
                    },
                  ]}
                  ticks={[
                    {
                      cutoff: sex === 'M' ? 0.25 : 0.22,
                      label: 'Cut-off',
                      color: 'danger',
                    },
                  ]}
                />
              </div>
              <div className="pt-2">
                <LineGraph
                  maxScore={4}
                  label="Non Rischio"
                  scores={[
                    {
                      score: parseFloat(prevnonRiskScore.toFixed(2)),
                      T: prevAdministration.T,
                    },
                    {
                      score: parseFloat(nextnonRiskScore.toFixed(2)),
                      T: nextAdministration.T,
                    },
                  ]}
                  ticks={[
                    {
                      cutoff: sex === 'M' ? 1.27 : 1.42,
                      label: 'Cut-off',
                      color: 'danger',
                    },
                  ]}
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
                Punteggio Medio
              </ToggleGroupItem>
              <ToggleGroupItem
                value="subjectiveScore"
                size="sm"
                className="flex-1 text-sm/3"
              >
                Benessere soggettivo
              </ToggleGroupItem>
              <ToggleGroupItem
                value="operationScore"
                size="sm"
                className="flex-1"
              >
                Funzionamento
              </ToggleGroupItem>

              <ToggleGroupItem
                value="symptomsScore"
                size="sm"
                className="flex-1"
              >
                Sintomi
              </ToggleGroupItem>
              <ToggleGroupItem value="riskScore" size="sm" className="flex-1">
                Rischio
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {renderGraph()}
        </CardFooter>
      </Card>
    </AdministrationContentCompare>
  );
}
