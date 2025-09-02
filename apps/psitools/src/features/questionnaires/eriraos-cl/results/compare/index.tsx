'use client';

import { useQuery } from '@tanstack/react-query';
import { Maximize2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Shimmer } from '@/components/ui/schimmer';
import { useColumnsCompare } from '@/features/questionnaires/components/table/columns';
import { AdministrationResultsTable } from '@/features/questionnaires/components/table/table';
import type { ExpressedSymptoms } from '@/features/questionnaires/eriraos-cl/results/administration/expressed-symptoms-details';
import type { FormValues } from '@/features/questionnaires/eriraos-cl/schema';
import { useTRPC } from '@/trpc/react';

import { ExpressedSymptomsDetails } from './expressed-symptoms-details';
import { ExpressedSymptomsGraph } from './expressed-symptoms-graph';

const CUT_OFF = 12;

export default function AdministrationResultsPQ16Page() {
  const searchParams = useSearchParams();
  const comparison = searchParams.getAll('comparison');
  const [tA, tB] = (comparison as [string, string]) ?? [];
  const columnsCompare = useColumnsCompare();

  const api = useTRPC();

  const { data, isLoading } = useQuery(
    api.administrations.findMany.queryOptions(
      {
        where: {
          id: {
            a: tA,
            b: tB,
          },
        },
        orderBy: {
          T: 'asc',
        },
      },
      {
        enabled: !!comparison || !!tA || !!tB,
      },
    ),
  );

  if (!data || isLoading) return <Shimmer className="h-full w-full" />;

  const [prevAdministration, nextAdministration] = data;

  if (!prevAdministration || !nextAdministration)
    return (
      <p>
        Errore nel ritrovamento delle informazioni relative alle
        somministrazioni.
      </p>
    );

  const prevRecords = prevAdministration?.records as FormValues;
  const nextRecords = nextAdministration?.records as FormValues;

  const prevResponse = prevRecords.response;
  const nextResponse = nextRecords.response;

  const prevSymptoms = prevResponse.items;
  const nextSymptoms = nextResponse.items;

  const prevScore = Object.values(prevSymptoms)
    .map((item) => item.value)
    .reduce((acc, item, index) => {
      const multiplier = () => {
        if (index <= 12) return 1;
        if (index >= 13 && index <= 14) return 2;
        return 3;
      };

      switch (item) {
        case 'sì':
          return acc + 2 * multiplier();
        case 'no':
          return acc;
        case 'uncertain':
          return acc + 1 * multiplier();
        default:
          return acc;
      }
    }, 0);

  const nextScore = Object.values(nextSymptoms)
    .map((item) => item.value)
    .reduce((acc, item, index) => {
      const multiplier = () => {
        if (index <= 12) return 1;
        if (index >= 13 && index <= 14) return 2;
        return 3;
      };

      switch (item) {
        case 'sì':
          return acc + 2 * multiplier();
        case 'no':
          return acc;
        case 'uncertain':
          return acc + 1 * multiplier();
        default:
          return acc;
      }
    }, 0);

  const prevExpressedSymptoms: ExpressedSymptoms = {
    sì: {
      'last-six-months': [],
      'all-life': [],
    },
    no: {
      'last-six-months': [],
      'all-life': [],
    },
    uncertain: {
      'last-six-months': [],
      'all-life': [],
    },
  };

  Object.entries(prevSymptoms).forEach(([key, item], index) => {
    const value = item.value;

    switch (value) {
      case 'sì':
        return index > 13
          ? prevExpressedSymptoms.sì['all-life'].push(key)
          : prevExpressedSymptoms.sì['last-six-months'].push(key);
      case 'no':
        return index > 13
          ? prevExpressedSymptoms.no['all-life'].push(key)
          : prevExpressedSymptoms.no['last-six-months'].push(key);
      default:
        return index > 13
          ? prevExpressedSymptoms.uncertain['all-life'].push(key)
          : prevExpressedSymptoms.uncertain['last-six-months'].push(key);
    }
  });

  const nextExpressedSymptoms: ExpressedSymptoms = {
    sì: {
      'last-six-months': [],
      'all-life': [],
    },
    no: {
      'last-six-months': [],
      'all-life': [],
    },
    uncertain: {
      'last-six-months': [],
      'all-life': [],
    },
  };

  Object.entries(nextSymptoms).forEach(([key, item], index) => {
    const value = item.value;

    switch (value) {
      case 'sì':
        return index > 13
          ? nextExpressedSymptoms.sì['all-life'].push(key)
          : nextExpressedSymptoms.sì['last-six-months'].push(key);
      case 'no':
        return index > 13
          ? nextExpressedSymptoms.no['all-life'].push(key)
          : nextExpressedSymptoms.no['last-six-months'].push(key);
      default:
        return index > 13
          ? nextExpressedSymptoms.uncertain['all-life'].push(key)
          : nextExpressedSymptoms.uncertain['last-six-months'].push(key);
    }
  });

  return (
    <div className="flex flex-col gap-8">
      {isLoading ? (
        <Shimmer className="h-full w-full" />
      ) : (
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="font-h2 pb-4">
              Early Recognition Inventory for the retrospective assessment of
              the onset of schizophrenia Checklist (ERIraos-CL)
            </h2>
            <div className="flex w-1/3 flex-col">
              <AdministrationResultsTable
                columns={columnsCompare}
                data={[prevAdministration, nextAdministration]}
                questionnaire="cba-ve"
              />
            </div>
          </section>

          <section>
            <Card className="w-fit">
              <CardHeader>
                <CardTitle>Sintomi espressi</CardTitle>
                <CardDescription>Cut-off = {CUT_OFF}</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpressedSymptomsGraph
                  prevExpressedSymptomsCount={prevScore}
                  nextExpressedSymptomsCount={nextScore}
                  prevT={prevAdministration.T ?? 0}
                  nextT={nextAdministration.T ?? 0}
                  cutOff={CUT_OFF}
                />
              </CardContent>
              <CardFooter>
                <Collapsible className="mt-4 grid w-full grid-cols-1">
                  <CollapsibleTrigger className="justify-self-end pb-4">
                    <Maximize2 />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ExpressedSymptomsDetails
                      prevExpressedSymptoms={prevExpressedSymptoms}
                      nextExpressedSymptoms={nextExpressedSymptoms}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </CardFooter>
            </Card>
          </section>
        </div>
      )}
    </div>
  );
}
