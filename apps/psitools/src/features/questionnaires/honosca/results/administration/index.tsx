'use client';

import { List, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { Shimmer } from '@/components/ui/schimmer';
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
import type { LineGraphScore } from '@/features/questionnaires/components/line-graph';
import { LineGraph } from '@/features/questionnaires/components/line-graph';
import type { FormValues } from '@/features/questionnaires/honosca/item';
import { QUESTIONS } from '@/features/questionnaires/honosca/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

const Value = ({ value }: { value: string }) => {
  return <span>{value}</span>;
};
export default function AdministrationResultsPage() {
  const [toggleValue, setToggleValue] = useState('dots');

  const { administration, isLoading } = useAdministration<FormValues>();
  if (!administration || isLoading)
    return <Shimmer className="h-full w-full" />;

  const { response } = administration.records;

  const GlobalPoint = Object.entries(response);

  const GlobalPointScore = GlobalPoint.map(
    ([, record]) => parseInt(record) || 0,
  ).reduce((acc, score) => acc + score, 0) satisfies LineGraphScore;

  const questions = Object.entries(response).map(([_, record], index) => {
    return {
      id: QUESTIONS[index].id,
      text: QUESTIONS[index].text,
      value: <Value value={QUESTIONS[index].options[parseInt(record)]} />,
    };
  }) satisfies ItemsListQuestions;

  const data = Object.values(response).map((record, index) => ({
    index: (index + 1).toString(),
    value: record ? parseInt(record) : 0,
  })) satisfies DotGraphDataSingle;

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="honosca"
      date={administration.date}
      T={administration.T}
    >
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
        </CardHeader>
        <CardContent>
          <LineGraph maxScore={60} scores={GlobalPointScore} ticks={[]} />
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
            <DotGraph T={administration.T ?? 0} domain={[0, 4]} data={data} />
          ) : (
            <ItemsList questions={questions} />
          )}
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
}
