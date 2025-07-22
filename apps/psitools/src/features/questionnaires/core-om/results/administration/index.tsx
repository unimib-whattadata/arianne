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
import type { FormValues } from '@/features/questionnaires/core-om/item';
import { QUESTIONS } from '@/features/questionnaires/core-om/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

const RESPONSES_DICT = {
  0: 'Per nulla',
  1: 'Solo Occasionalmente',
  2: 'Ogni Tanto',
  3: 'Spesso',
  4: 'Molto Spesso o sempre',
} as const;

type TValue = keyof typeof RESPONSES_DICT;

const Value = ({ value }: { value: TValue }) => {
  return (
    <div className="flex h-full">
      <Separator className="h-full w-px bg-slate-300" />
      <span className="flex px-2 font-semibold">{RESPONSES_DICT[value]}</span>
    </div>
  );
};

export default function AdministrationResultsPswq16Page() {
  const [toggleValue, setToggleValue] = useState('dots');
  const [toggleGraph, setToggleGraph] = useState<string>('chart');
  const [scale, setScale] = useState<string>('global');

  const { administration, isLoading, sex } = useAdministration<FormValues>({
    isComparison: false,
    hasSex: true,
  });

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

  const { response, score } = administration.records;

  if (!response || !score) return null;

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

  const globalQuestions = Object.entries(response).map(([_, value], index) => {
    const question = QUESTIONS[index];
    const reverseValue = question.reverse ? 4 - +value : +value;

    return {
      id: `${index + 1}${question.reverse ? 'R' : ''}`,
      text: question.text,
      value: <Value value={reverseValue as TValue} />,
    };
  }) satisfies ItemsListQuestions;

  //START symptom Questions

  const symptomsAnxietyQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return symptomsAnxietyScore.includes(+id);
    })
    .map(([key, value]) => {
      const id = +key.split('-')[1];
      const question = QUESTIONS[id - 1];
      const reverseValue = question.reverse ? 4 - +value : +value;

      return {
        id: `${id}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: <Value value={reverseValue as TValue} />,
      };
    }) satisfies ItemsListQuestions;

  const symptomsDepressionQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return symptomsDepressionScore.includes(+id);
    })
    .map(([key, value]) => {
      const id = +key.split('-')[1];
      const question = QUESTIONS[id - 1];
      const reverseValue = question.reverse ? 4 - +value : +value;

      return {
        id: `${id}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: <Value value={reverseValue as TValue} />,
      };
    }) satisfies ItemsListQuestions;

  const symptomsPhysicalQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return symptomsPhysicalScore.includes(+id);
    })
    .map(([key, value]) => {
      const id = +key.split('-')[1];
      const question = QUESTIONS[id - 1];
      const reverseValue = question.reverse ? 4 - +value : +value;

      return {
        id: `${id}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: <Value value={reverseValue as TValue} />,
      };
    }) satisfies ItemsListQuestions;

  const symptomsTraumaQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return symptomsTraumaScore.includes(+id);
    })
    .map(([key, value]) => {
      const id = +key.split('-')[1];
      const question = QUESTIONS[id - 1];
      const reverseValue = question.reverse ? 4 - +value : +value;

      return {
        id: `${id}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: <Value value={reverseValue as TValue} />,
      };
    }) satisfies ItemsListQuestions;

  //END symptom Questions

  //START Subjective Questions

  const subjectiveScoreQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return subjectiveScore.includes(+id);
    })
    .map(([key, value]) => {
      const id = +key.split('-')[1];
      const question = QUESTIONS[id - 1];
      const reverseValue = question.reverse ? 4 - +value : +value;

      return {
        id: `${id}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: <Value value={reverseValue as TValue} />,
      };
    }) satisfies ItemsListQuestions;
  //END Subjective Questions

  //START Operation Questions

  const operationGeneralQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return operationGeneralScore.includes(+id);
    })
    .map(([key, value]) => {
      const id = +key.split('-')[1];
      const question = QUESTIONS[id - 1];
      const reverseValue = question.reverse ? 4 - +value : +value;

      return {
        id: `${id}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: <Value value={reverseValue as TValue} />,
      };
    }) satisfies ItemsListQuestions;

  const operationIntimateQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return operationIntimateScore.includes(+id);
    })
    .map(([key, value]) => {
      const id = +key.split('-')[1];
      const question = QUESTIONS[id - 1];
      const reverseValue = question.reverse ? 4 - +value : +value;

      return {
        id: `${id}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: <Value value={reverseValue as TValue} />,
      };
    }) satisfies ItemsListQuestions;

  const operationSocialQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return operationSocialScore.includes(+id);
    })
    .map(([key, value]) => {
      const id = +key.split('-')[1];
      const question = QUESTIONS[id - 1];
      const reverseValue = question.reverse ? 4 - +value : +value;

      return {
        id: `${id}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: <Value value={reverseValue as TValue} />,
      };
    }) satisfies ItemsListQuestions;

  //END Operation Questions

  //START Risk Questions

  const riskharmingSelfScoreQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return riskharmingSelfScore.includes(+id);
    })
    .map(([key, value]) => {
      const id = +key.split('-')[1];
      const question = QUESTIONS[id - 1];
      const reverseValue = question.reverse ? 4 - +value : +value;

      return {
        id: `${id}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: <Value value={reverseValue as TValue} />,
      };
    }) satisfies ItemsListQuestions;

  const riskheterolesiveScoreQuestions = Object.entries(response)
    .filter(([index, _]) => {
      const id = index.split('-')[1];
      return riskheterolesiveScore.includes(+id);
    })
    .map(([key, value]) => {
      const id = +key.split('-')[1];
      const question = QUESTIONS[id - 1];
      const reverseValue = question.reverse ? 4 - +value : +value;

      return {
        id: `${id}${question.reverse ? 'R' : ''}`,
        text: question.text,
        value: <Value value={reverseValue as TValue} />,
      };
    }) satisfies ItemsListQuestions;

  //END Risk Questions

  const globalData = Object.entries(response).map(([key, value]) => ({
    index: key.split('-')[1],
    value: +value,
  })) satisfies DotGraphDataSingle;

  const symptomsScoreData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return symptomsScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  const subjectiveScoreData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1]);
      return subjectiveScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  const operationScoreData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return operationScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  const riskScoreData = Object.entries(response)
    .filter(([key]) => {
      const indexNumber = parseInt(key.split('-')[1], 10);
      return riskScore.includes(indexNumber);
    })
    .map(([key, value]) => ({
      index: key.split('-')[1],
      value: +value,
    })) satisfies DotGraphDataSingle;

  //Punteggio  Totale
  const totalResponsesScore =
    score.symptomsScore * symptomsScore.length +
    score.subjectiveScore * subjectiveScore.length +
    score.operationScore * operationScore.length +
    score.riskScore * riskScore.length;

  //Punteggio  di non rischio
  const nonRiskScore =
    (totalResponsesScore - score.riskScore * riskScore.length) / 28;

  //Punteggio Medio
  const Totaverage = totalResponsesScore / 34;

  // const globalScale =
  //   (score.symptomsScore +
  //     score.subjectiveScore +
  //     score.operationScore +
  //     score.riskScore) /
  //   5;

  const renderDotGraph = () => {
    let data: DotGraphDataSingle;
    switch (scale) {
      case 'symptomsScore':
        data = symptomsScoreData;
        break;
      case 'subjectiveScore':
        data = subjectiveScoreData;
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
        T={administration.T ?? 0}
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

    return <ItemsList questions={q} />;
  };

  const renderGraph = () => {
    if (toggleValue === 'dots') return renderDotGraph();
    return renderItemsList();
  };

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="core-om"
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
            <div className="relative grid grid-cols-[220px_220px_220px] place-items-stretch gap-4">
              <ScoreCard
                score={+Totaverage.toFixed(2)}
                label="Punteggio Medio Totale"
                className="m-0 rounded-md bg-slate-100"
              />
              <ScoreCard
                score={+score.subjectiveScore.toFixed(2)}
                label="Benessere soggettivo"
                className="m-0 rounded-md border border-slate-100"
              />
              <ScoreCard
                score={+score.operationScore.toFixed(2)}
                label="Funzionamento"
                className="m-0 rounded-md border border-slate-100"
              />
              <ScoreCard
                score={+score.symptomsScore.toFixed(2)}
                label="Sintomi"
                className="m-0 rounded-md border border-slate-100"
              />
              <ScoreCard
                score={+score.riskScore.toFixed(2)}
                label="Rischio"
                className="m-0 rounded-md border border-slate-100"
              />
              <ScoreCard
                score={+nonRiskScore.toFixed(2)}
                label="Non rischio"
                className="m-0 rounded-md border border-slate-100"
              />
            </div>
          ) : (
            <>
              <div className="pb-2">
                <LineGraph
                  maxScore={4}
                  label="Punteggio Medio"
                  scores={parseFloat(Totaverage.toFixed(2))}
                  ticks={[
                    {
                      cutoff: sex === 'M' ? 1.09 : 1.2,
                      label: 'Cut-off',
                      color: 'danger',
                    },
                  ]}
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
                  scores={parseFloat(score.subjectiveScore.toFixed(2))}
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
                  label="Funzionamento"
                  scores={parseFloat(score.operationScore.toFixed(2))}
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
                  scores={parseFloat(score.symptomsScore.toFixed(2))}
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
                  scores={parseFloat(score.riskScore.toFixed(2))}
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
                  label="Non-Rischio"
                  scores={parseFloat(nonRiskScore.toFixed(2))}
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
    </AdministrationContent>
  );
}
