'use client';

import { CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/sckeleton';
import {
  AdministrationContent,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/questionnaires/components/administration';
import type { ItemsListQuestions } from '@/features/questionnaires/components/items-list';
import { ItemsList } from '@/features/questionnaires/components/items-list';
import { LineGraph } from '@/features/questionnaires/components/line-graph';
import { QUESTIONS } from '@/features/questionnaires/hcl-32/questions';
import type { FormValues } from '@/features/questionnaires/hcl-32/schema';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import { cn } from '@/utils/cn';

const Value = ({ value, id }: { value: string; id: number }) => {
  return (
    <span
      className={cn(
        'flex rounded-full',
        id <= 33 &&
          (value === 'true'
            ? 'justify-center bg-red-200 px-2 font-semibold text-red-600'
            : 'justify-center bg-green-200 px-2 font-semibold text-green-600'),
      )}
    >
      {value === 'true' ? 'Sì' : 'No'}
    </span>
  );
};

export default function AdministrationResultsHcl32Page() {
  const { administration, isLoading } = useAdministration<FormValues>();

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

  const { response } = administration.records;

  const score = Object.entries(response.items).filter(([key, record]) => {
    const questionIndex = parseInt(key.split('-')[1], 10);
    return questionIndex >= 2 && questionIndex <= 33 && record === 'true';
  });

  const scoreCount = score.length;
  //Gestione ids

  const questions = Object.entries(response.items)
    .map(([key, _]) => {
      const questionIndex = parseInt(key.split('-')[1], 10);
      const question = QUESTIONS.find((q) => q.index === questionIndex);

      if (question) {
        return {
          id: question.index,
          text: question.text,
          value: (
            <Value
              value={response.items[`item-${question.index}`]}
              id={question.index}
            />
          ),
        };
      }
    })
    .filter((item) => item !== undefined) satisfies ItemsListQuestions;

  const filteredQuestions = questions.filter(
    (question) => question.id >= 2 && question.id <= 33,
  );

  const questionThree = questions.filter(
    (question) => question.id >= 34 && question.id <= 35,
  );

  const questionFive = questions
    .filter((question) => question.id === 38)
    .map((question) => ({
      ...question,
      value:
        QUESTIONS.find((q) => q.index === question.id)?.options[
          Number(response.items[`item-${question.id}`])
        ] || 'Nessuna risposta selezionata',
    }));

  const questionSeven = questions
    .filter((question) => question.id >= 41 && question.id <= 44)
    .map((question) => ({
      ...question,
      value:
        QUESTIONS.find((q) => q.index === question.id)?.options[
          Number(response.items[`item-${question.id}`])
        ] || 'Nessuna risposta selezionata',
    }));

  const questionEight = questions
    .filter((question) => question.id >= 45 && question.id <= 48)
    .map((question) => {
      const responseValue = response.items[`item-${question.id}`];

      const transformedValue =
        responseValue === 'true'
          ? 'si'
          : responseValue === 'false'
            ? 'no'
            : 'N/A';

      return {
        ...question,
        value: transformedValue,
      };
    });

  const additionalQuestions = [
    { id: 36, text: QUESTIONS[35].text },
    { id: 37, text: QUESTIONS[36].text },
    { id: 39, text: QUESTIONS[38].text },
    { id: 40, text: QUESTIONS[39].text },
  ];

  const questionFour = additionalQuestions
    .filter((question) => question.id === 36 || question.id === 37)
    .map((question) => ({
      ...question,
      value:
        response.items[`item-${question.id}`] || 'Nessuna risposta fornita',
    }));

  const questionSix = additionalQuestions
    .filter((question) => question.id === 39 || question.id === 40)
    .map((question) => ({
      ...question,
      value:
        response.items[`item-${question.id}`] || 'Nessuna risposta fornita',
    }));

  const combinedQuestions = [
    ...questionThree,
    ...questionFour,
    ...questionFive,
  ];

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="hcl-32"
      date={administration.date}
      T={administration.T}
    >
      <div className="flex max-w-fit gap-2 rounded-lg border bg-card p-4 text-sm text-card-foreground shadow-sm">
        <p className="font-bold">
          Come si sente oggi rispetto a come si sente normalmente?
        </p>
        {response.items['item-1'] !== undefined
          ? QUESTIONS.find((q) => q.index === 1)?.options[
              Number(response.items['item-1'])
            ] || 'Nessuna risposta selezionata'
          : 'Nessuna risposta selezionata'}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Cut-off = 12</CardDescription>
          <LineGraph
            maxScore={32}
            scores={scoreCount}
            ticks={[{ cutoff: 12, label: 'Cut-off', color: 'danger' }]}
          />
        </CardContent>
        <CardFooter>
          <h2 className="pb-2 text-base font-bold">Sintomi espressi</h2>
          <ItemsList questions={filteredQuestions} />
        </CardFooter>
      </Card>
      <Card>
        <div className="pt-4">
          <CardContent>
            <div className="pb-2 text-sm">
              <ItemsList questions={combinedQuestions} />
            </div>
          </CardContent>
          <CardContent>
            <div className="pb-2 text-sm">
              <ItemsList
                questions={questionSix}
                label="E quanto è durato il periodo più lungo di questo tipo (in mesi e giorni)?"
              />
            </div>
          </CardContent>
          <CardContent>
            <div className="pb-2 text-sm">
              <ItemsList
                questions={questionSeven}
                label="Quali sono state le conseguenze del suo essere “su di giri” sui seguenti aspetti della sua vita"
              />
            </div>
          </CardContent>
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
              />
            </div>
          </CardContent>
        </div>
      </Card>
    </AdministrationContent>
  );
}
