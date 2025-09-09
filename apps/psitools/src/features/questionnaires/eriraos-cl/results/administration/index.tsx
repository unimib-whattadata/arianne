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
import type { ItemsListQuestions } from '@/features/questionnaires/components/items-list';
import { ItemsList } from '@/features/questionnaires/components/items-list';
import { LineGraph } from '@/features/questionnaires/components/line-graph';
import { QUESTIONS } from '@/features/questionnaires/eriraos-cl/questions';
import type { FormValues } from '@/features/questionnaires/eriraos-cl/schema';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import { cn } from '@/utils/cn';

import type { ExpressedSymptoms } from './expressed-symptoms-details';

const Value = ({ value }: { value: string }) => {
  return (
    <span
      className={cn(
        'flex justify-center rounded-full px-2 font-semibold',
        value === 'sì' && 'bg-red-200 text-red-500',
        value === 'no' && 'bg-green-200 text-green-500',
        value === 'uncertain' && 'bg-yellow-200 text-yellow-500',
      )}
    >
      {value === 'uncertain' ? '?' : value}
    </span>
  );
};

export default function AdministrationResultsPage() {
  const { administration, isLoading } = useAdministration<FormValues>();

  if (!administration || isLoading)
    return <Shimmer className="h-full w-full" />;

  const { response } = administration.records;

  const symptoms = response.items;

  const score = Object.values(symptoms)
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

  const expressedSymptoms: ExpressedSymptoms = {
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

  Object.entries(symptoms).forEach(([key, item], index) => {
    const value = item.value;

    switch (value) {
      case 'sì':
        return index > 13
          ? expressedSymptoms.sì['all-life'].push(key)
          : expressedSymptoms.sì['last-six-months'].push(key);
      case 'no':
        return index > 13
          ? expressedSymptoms.no['all-life'].push(key)
          : expressedSymptoms.no['last-six-months'].push(key);
      default:
        return index > 13
          ? expressedSymptoms.uncertain['all-life'].push(key)
          : expressedSymptoms.uncertain['last-six-months'].push(key);
    }
  });

  const questions = Object.entries(symptoms).map(([_, item], index) => {
    return {
      id: QUESTIONS[index].index,
      text: QUESTIONS[index].text,
      value: <Value value={item.value} />,
    };
  }) satisfies ItemsListQuestions;

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="eriraos-cl"
      date={administration.date}
      T={administration.T}
    >
      <Card>
        <CardHeader>
          <CardTitle>Sintomi espressi</CardTitle>
          <CardDescription>Cut-off = 6</CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={46}
            scores={score}
            ticks={{ cutoff: 12, label: 'Cut-off', color: 'danger' }}
          />
        </CardContent>
        <CardFooter>
          <ItemsList questions={questions} />
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
}
