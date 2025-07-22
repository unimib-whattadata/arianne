'use client';

import { Shimmer } from '@/components/ui/schimmer';
import {
  AdministrationContent,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/questionnaires/components/administration';
import { LineGraph } from '@/features/questionnaires/components/line-graph';
import type { FormValues } from '@/features/questionnaires/gaf-sofas/item';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

import { Details } from './details';

export default function AdministrationResultsGafsofasPage() {
  const { administration, isLoading } = useAdministration<FormValues>();

  if (!administration || isLoading)
    return <Shimmer className="h-full w-full" />;

  const { response } = administration.records;

  const score = response.value[0];

  if (!score) return null;

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="gad-7"
      date={administration.date}
      T={administration.T}
    >
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
          <CardDescription>
            <span className="block">Cut-off = 10</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph maxScore={100} scores={score} ticks={[]} />
        </CardContent>
        <CardFooter>
          <Details score={score} />
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
}
