'use client';

import { List, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { Shimmer } from '@/components/ui/schimmer';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  AdministrationContentCompare,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/questionnaires/components/administration';
import type { DotGraphDataComparison } from '@/features/questionnaires/components/dot-graph';
import { DotGraph } from '@/features/questionnaires/components/dot-graph';
import type { ItemsListQuestions } from '@/features/questionnaires/components/items-list';
import { ItemsList } from '@/features/questionnaires/components/items-list';
import type { LineGraphScore } from '@/features/questionnaires/components/line-graph';
import { LineGraph } from '@/features/questionnaires/components/line-graph';
import type { FormValues } from '@/features/questionnaires/gss/item';
import { QUESTIONS } from '@/features/questionnaires/gss/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import { cn } from '@/utils/cn';

const RESPONSES_DICT = {
  1: 'Mai vero',
  2: 'Quasi mai vero',
  3: 'Raramente vero',
  4: 'Ogni tanto vero',
  5: 'Spesso vero',
  6: 'Quasi sempre vero',
  7: 'Sempre vero',
} as const;

type TValue = keyof typeof RESPONSES_DICT;

const Value = ({
  value,
  currentValue,
  otherValue,
}: {
  value: TValue;
  currentValue: TValue;
  otherValue: TValue;
}) => {
  // Usa i punteggi originali per determinare se è "peggiore" (isWorse)
  const isWorse = currentValue > otherValue;

  return (
    <p
      className={cn(
        'flex rounded-md px-2 font-semibold',
        isWorse && 'bg-red-200 text-red-500',
      )}
    >
      {RESPONSES_DICT[value]}
    </p>
  );
};

export default function AdministrationResultsGSSPage() {
  const [toggleValue, setToggleValue] = useState('dots');

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

  const { response: prevResponse, score: prevScore } =
    prevAdministration.records;
  const { response: nextResponse, score: nextScore } =
    nextAdministration.records;

  if (
    prevResponse === undefined ||
    prevScore === undefined ||
    nextResponse === undefined ||
    nextScore === undefined
  )
    return null;

  const invertResponse = (questionIndex: number, value: number) => {
    if ([1, 5, 8].includes(questionIndex)) {
      switch (value) {
        case 7:
          return 1;
        case 6:
          return 2;
        case 5:
          return 3;
        case 4:
          return 4;
        case 3:
          return 5;
        case 2:
          return 6;
        case 1:
          return 7;
        default:
          return value;
      }
    }
    return value;
  };

  const prevExpressedSymptoms = Object.entries(prevResponse);
  const nextExpressedSymptoms = Object.entries(nextResponse);

  // Calcola i punteggi complessivi senza inversione per il confronto isWorse
  const prevExpressedSymptomsScore = prevExpressedSymptoms
    .map(([, record]) => parseInt(record) || 0)
    .reduce((acc, score) => acc + score, 0) satisfies LineGraphScore;

  const nextExpressedSymptomsScore = nextExpressedSymptoms
    .map(([, record]) => parseInt(record) || 0)
    .reduce((acc, score) => acc + score, 0) satisfies LineGraphScore;

  // Modifica per visualizzare le risposte corrette (invertite) per la visualizzazione
  const questions = Object.entries(prevResponse).map(([id, record], index) => {
    const questionIndex = index + 1;
    const invertedValuePrev = invertResponse(questionIndex, parseInt(record));
    const invertedValueNext = invertResponse(
      questionIndex,
      parseInt(nextResponse[id]),
    );

    return {
      id: QUESTIONS[index].id,
      text: QUESTIONS[index].text,
      value: {
        prev: (
          <Value
            value={invertedValuePrev as TValue}
            currentValue={parseInt(record) as TValue} // Usa il punteggio corretto per il confronto
            otherValue={parseInt(nextResponse[id]) as TValue} // Usa il punteggio corretto per il confronto
          />
        ),
        next: (
          <Value
            value={invertedValueNext as TValue}
            currentValue={parseInt(nextResponse[id]) as TValue} // Usa il punteggio corretto per il confronto
            otherValue={parseInt(record) as TValue} // Usa il punteggio corretto per il confronto
          />
        ),
      },
    };
  }) satisfies ItemsListQuestions;

  const data = Object.entries(prevResponse).map(([key, value]) => ({
    index: key.split('-')[1],
    prev: +value,
    next: +nextResponse[key],
  })) satisfies DotGraphDataComparison;

  return (
    <AdministrationContentCompare
      isLoading={isLoading}
      type="gss"
      administrations={[prevAdministration, nextAdministration]}
      title="Guilt Sensitivity Scale (GSS)"
    >
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
          <CardDescription>Punteggio minimo = 7</CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={63}
            scores={[
              { score: prevExpressedSymptomsScore, T: prevAdministration.T },
              { score: nextExpressedSymptomsScore, T: nextAdministration.T },
            ]}
            ticks={{ cutoff: 7, label: 'Punteggio minimo' }}
          />
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
              <ScatterChart />
            </ToggleGroupItem>
            <ToggleGroupItem value="list">
              <List />
            </ToggleGroupItem>
          </ToggleGroup>
          {toggleValue === 'dots' ? (
            <DotGraph
              T={[prevAdministration.T, nextAdministration.T]}
              domain={[1, 7]}
              data={data}
            />
          ) : (
            <ItemsList
              T={[prevAdministration.T, nextAdministration.T]}
              questions={questions}
            />
          )}
        </CardFooter>
      </Card>
    </AdministrationContentCompare>
  );
}
