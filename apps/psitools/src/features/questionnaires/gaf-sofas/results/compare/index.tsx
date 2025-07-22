'use client';

import { Shimmer } from '@/components/ui/schimmer';
import {
  AdministrationContentCompare,
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

export default function AdministrationResultsPQ16Page() {
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

  const { response: prevResponse } = prevAdministration.records;
  const { response: nextResponse } = nextAdministration.records;

  return (
    <AdministrationContentCompare
      isLoading={isLoading}
      type="gaf-sofas"
      administrations={[prevAdministration, nextAdministration]}
      title="General Anxiety Disorder-7 (GAD-7)"
    >
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
          <CardDescription>
            <span className="block">Cut-off = 10</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={100}
            scores={[
              { score: prevResponse.value[0], T: prevAdministration.T },
              { score: nextResponse.value[0], T: nextAdministration.T },
            ]}
            ticks={[]}
          />
        </CardContent>
        <CardFooter>
          <Details
            prevResponse={prevResponse}
            nextResponse={nextResponse}
            prevT={prevAdministration.T ?? 0}
            nextT={nextAdministration.T ?? 0}
          />
        </CardFooter>
      </Card>
    </AdministrationContentCompare>
  );
}
