'use client';

import { Skeleton } from '@/components/ui/sckeleton';
import { Separator } from '@/components/ui/separator';
import {
  AdministrationContentCompare,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/questionnaires/components/administration';
import { ComparisonCards } from '@/features/questionnaires/components/comparison-card';
import type { ItemsListQuestions } from '@/features/questionnaires/components/items-list';
import { ItemsList } from '@/features/questionnaires/components/items-list';
import { LineGraph } from '@/features/questionnaires/components/line-graph';
import { QUESTIONS } from '@/features/questionnaires/hcl-32/questions';
import type { FormValues } from '@/features/questionnaires/hcl-32/schema';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import { cn } from '@/utils/cn';

const Value = ({ value }: { value: string }) => {
  return (
    <span
      className={cn(
        'flex justify-center rounded-full px-2 font-semibold',
        value === 'true'
          ? 'bg-red-200 text-red-600'
          : 'bg-green-200 text-green-600',
      )}
    >
      {value === 'true' ? 'Sì' : 'No'}
    </span>
  );
};

const Value2 = ({ value }: { value: string }) => {
  return (
    <div className="flex h-full pl-1">
      <Separator className="h-full w-px bg-slate-300" />
      <span>
        <p className={cn('flex rounded-full')}>{value}</p>
      </span>
    </div>
  );
};

export default function AdministrationResultsHcl32Page() {
  const { administration, isLoading } = useAdministration<FormValues>({
    isComparison: true,
  });

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

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

  //Calcolo score
  const prevScore = Object.entries(prevResponse.items).filter(
    ([key, record]) => {
      const questionIndex = parseInt(key.split('-')[1], 10);
      return questionIndex >= 2 && questionIndex <= 33 && record === 'true';
    },
  );
  const prevScoreCount = prevScore.length;

  const nextScore = Object.entries(nextResponse.items).filter(
    ([key, record]) => {
      const questionIndex = parseInt(key.split('-')[1], 10);
      return questionIndex >= 2 && questionIndex <= 33 && record === 'true';
    },
  );
  const nextScoreCount = nextScore.length;

  //Questions

  const questions = Object.entries(prevResponse.items)
    .map(([key], _) => {
      const questionIndex = parseInt(key.split('-')[1], 10);
      const question = QUESTIONS.find((q) => q.index === questionIndex);
      if (question) {
        return {
          id: question.index,
          text: question.text,
          value: {
            prev: (
              <Value value={prevResponse.items[`item-${question.index}`]} />
            ),
            next: <Value value={nextResponse.items[key]} />,
          },
        };
      }
    })
    .filter((item) => item !== undefined) satisfies ItemsListQuestions;

  const filteredQuestions = questions.filter(
    (question) => question.id >= 2 && question.id <= 33,
  );

  const questionThree = QUESTIONS.filter(
    (question) => question.index >= 34 && question.index <= 35,
  ).map((question) => {
    const prevRaw = prevResponse.items[`item-${question.index}`];
    const nextRaw = nextResponse.items[`item-${question.index}`];

    const prevValue =
      prevRaw === 'true'
        ? 'sì'
        : prevRaw === 'false'
          ? 'no'
          : question.options[parseInt(prevRaw, 10)] || `${prevRaw}`;

    const nextValue =
      nextRaw === 'true'
        ? 'sì'
        : nextRaw === 'false'
          ? 'no'
          : question.options[parseInt(nextRaw, 10)] || `${nextRaw}`;

    return {
      id: question.index,
      text: question.text,
      value: {
        prev: <Value2 value={prevValue} />,
        next: <Value2 value={nextValue} />,
      },
    };
  });

  const questionFive = questions
    .filter((question) => question.id === 38)
    .map((question) => ({
      ...question,
      value: {
        prev: (
          <Value2
            value={
              QUESTIONS.find((q) => q.index === question.id)?.options[
                Number(prevResponse.items[`item-${question.id}`])
              ] || 'N/A'
            }
          ></Value2>
        ),
        next: (
          <Value2
            value={
              QUESTIONS.find((q) => q.index === question.id)?.options[
                Number(nextResponse.items[`item-${question.id}`])
              ] || 'N/A'
            }
          ></Value2>
        ),
      },
    }));

  const questionSeven = questions
    .filter((question) => question.id >= 41 && question.id <= 44)
    .map((question) => ({
      ...question,
      value: {
        prev: (
          <Value2
            value={
              QUESTIONS.find((q) => q.index === question.id)?.options[
                Number(prevResponse.items[`item-${question.id}`])
              ] || 'N/A'
            }
          ></Value2>
        ),
        next: (
          <Value2
            value={
              QUESTIONS.find((q) => q.index === question.id)?.options[
                Number(nextResponse.items[`item-${question.id}`])
              ] || 'N/A'
            }
          ></Value2>
        ),
      },
    }));

  const questionEight = QUESTIONS.filter(
    (question) => question.index >= 45 && question.index <= 48,
  ).map((question) => {
    const prevRaw = prevResponse.items[`item-${question.index}`];
    const nextRaw = nextResponse.items[`item-${question.index}`];

    const prevValue =
      prevRaw === 'true'
        ? 'sì'
        : prevRaw === 'false'
          ? 'no'
          : question.options[parseInt(prevRaw, 10)] || `${prevRaw}`;

    const nextValue =
      nextRaw === 'true'
        ? 'sì'
        : nextRaw === 'false'
          ? 'no'
          : question.options[parseInt(nextRaw, 10)] || `${nextRaw}`;

    return {
      id: question.index,
      text: question.text,
      value: {
        prev: <Value2 value={prevValue} />,
        next: <Value2 value={nextValue} />,
      },
    };
  });

  const questionFour = QUESTIONS.filter(
    (question) => question.index >= 36 && question.index <= 37,
  ).map((QUESTIONS) => {
    return {
      id: QUESTIONS.index,
      text: QUESTIONS.text,
      value: {
        prev: (
          <Value2
            value={
              prevResponse.items[`item-${QUESTIONS.index}`] ||
              'Nessuna nota fornita'
            }
          />
        ),
        next: (
          <Value2
            value={
              nextResponse.items[`item-${QUESTIONS.index}`] ||
              'Nessuna nota fornita'
            }
          />
        ),
      },
    };
  });

  const questionSix = QUESTIONS.filter(
    (question) => question.index >= 39 && question.index <= 40,
  ).map((QUESTIONS) => {
    return {
      id: QUESTIONS.index,
      text: QUESTIONS.text,
      value: {
        prev: (
          <Value2
            value={
              prevResponse.items[`item-${QUESTIONS.index}`] ||
              'Nessuna nota fornita'
            }
          />
        ),
        next: (
          <Value2
            value={
              nextResponse.items[`item-${QUESTIONS.index}`] ||
              'Nessuna nota fornita'
            }
          />
        ),
      },
    };
  });
  const combinedQuestions = [
    ...questionThree,
    ...questionFour,
    ...questionFive,
  ];

  return (
    <AdministrationContentCompare
      isLoading={isLoading}
      type="hcl-32"
      administrations={[prevAdministration, nextAdministration]}
      title="Hypomania check list-32 (HCL-32)"
    >
      <section>
        <h2 className="font-h2 pb-4">Differenza tra le somministrazioni</h2>
        <div className="mb-8 flex max-w-fit gap-2 rounded-lg border bg-card p-4 text-sm text-card-foreground shadow-sm">
          <p className="font-bold">
            Come si sente oggi rispetto a come si sente normalmente?
          </p>
          <p className="text-sm font-bold text-green-700">
            T{prevAdministration.T}:
          </p>
          {prevResponse.items['item-1'] !== undefined
            ? QUESTIONS.find((q) => q.index === 1)?.options[
                Number(prevResponse.items['item-1'])
              ] || 'Nessuna risposta selezionata'
            : 'Nessuna risposta selezionata'}
          <Separator orientation="vertical"></Separator>
          <p className="text-sm font-bold text-green-700">
            T{nextAdministration.T}:
          </p>
          {nextResponse.items['item-1'] !== undefined
            ? QUESTIONS.find((q) => q.index === 1)?.options[
                Number(nextResponse.items['item-1'])
              ] || 'Nessuna risposta selezionata'
            : 'Nessuna risposta selezionata'}
        </div>

        <div className="flex gap-2">
          <ComparisonCards
            prev={prevScoreCount}
            next={nextScoreCount}
            baseText="I sintomi sono"
            comparisonText={{
              positive: 'peggiorati',
              negative: 'migliorati',
              indifferent: 'rimasti invariati',
            }}
          />
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Sintomi espressi</CardTitle>
          <CardDescription>Cut-off = 12</CardDescription>
        </CardHeader>
        <CardContent>
          <LineGraph
            maxScore={32}
            scores={[
              { T: prevAdministration.T, score: prevScoreCount },
              { T: nextAdministration.T, score: nextScoreCount },
            ]}
            ticks={[{ cutoff: 12, label: 'Cut-off', color: 'danger' }]}
          />
        </CardContent>
        <CardFooter>
          <ItemsList
            T={[prevAdministration.T, nextAdministration.T]}
            questions={filteredQuestions}
          />
        </CardFooter>
      </Card>
      <Card>
        <div className="pt-4">
          <CardContent>
            <div className="pb-2 text-sm">
              <ItemsList
                questions={combinedQuestions}
                T={[prevAdministration.T, nextAdministration.T]}
              />
            </div>
          </CardContent>
          <Separator className="bg-primary mx-auto mb-5 w-[96%]" />
          <CardContent>
            <div className="pb-2 text-sm">
              <ItemsList
                questions={questionSix}
                label="E quanto è durato il periodo più lungo di questo tipo (in mesi e giorni)?"
                T={[prevAdministration.T, nextAdministration.T]}
              />
            </div>
          </CardContent>
          <Separator className="bg-primary mx-auto mb-5 w-[96%]" />

          <CardContent>
            <div className="pb-2 text-sm">
              <ItemsList
                questions={questionSeven}
                label="Quali sono state le conseguenze del suo essere “su di giri” sui seguenti aspetti della sua vita"
                T={[prevAdministration.T, nextAdministration.T]}
              />
            </div>
          </CardContent>
          <Separator className="bg-primary mx-auto mb-5 w-[96%]" />

          <CardContent>
            <div className="text-sm">
              <ItemsList
                questions={questionEight}
                label={
                  <>
                    La preghiamo di dirci ora se le seguenti affermazioni la
                    descrivono bene o no come è di solito,
                    <br />
                    indipendentemente da come sta adesso.
                  </>
                }
                T={[prevAdministration.T, nextAdministration.T]}
              />
            </div>
          </CardContent>
        </div>
      </Card>
    </AdministrationContentCompare>
  );
}
