import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormContent,
  FormFooter,
  FormHeader,
  FormInstructions,
  FormSubmit,
} from '@/features/questionnaires/components/form';
import type { FormValues } from '@/features/questionnaires/eat-26/item';
import { formSchema, Item } from '@/features/questionnaires/eat-26/item';
import { QUESTIONS } from '@/features/questionnaires/eat-26/questions';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';

export const mapScore = (value: number, isReverse = false): number => {
  if (isReverse) {
    if (value === 1) return 3;
    if (value === 2) return 2;
    if (value === 3) return 1;
    return 0;
  } else {
    if (value <= 3) return 0;
    if (value === 4) return 1;
    if (value === 5) return 2;
    return 3;
  }
};

const NewAdministration = () => {
  const [step, setStep] = useState(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    return {
      score: {
        testScore: Object.entries(data.response).reduce((acc, [key, value]) => {
          const questionId = parseInt(key.split('-')[1], 10);
          if (questionId > 26) return acc;
          const question = QUESTIONS.find((q) => q.id === questionId);
          if (!question) return acc;
          return acc + mapScore(parseInt(value), question.reverse);
        }, 0),

        behaviour: Object.entries(data.response).reduce(
          (acc, [_, value], index) => {
            if (index >= 26) {
              return acc + mapScore(parseInt(value));
            }
            return acc;
          },
          0,
        ),
      },

      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'eat-26',
  });
  const QUESTIONS_ONE = QUESTIONS.slice(0, 26);
  const QUESTIONS_TWO = QUESTIONS.slice(26);

  const nextStep = () => {
    setStep((prev) => (prev === 2 ? prev : prev + 1));
  };

  const prevStep = () => {
    setStep((prev) => (prev === 1 ? prev : prev - 1));
  };

  return (
    <FormContent<FormValues>
      form={form}
      title="Eating Attitude Test 26 (EAT-26)"
    >
      {step === 1 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p className="mb-4 rounded-md bg-white-900 p-4">
                Troverai qui di seguito una lista di affermazioni. Ti preghiamo
                di rispondere a tutte le domande selezionando la risposta che
                meglio ti rispecchia.
              </p>
              <p className="font-bold">
                Ricorda che non esistono risposte giuste o sbagliate
              </p>
            </FormInstructions>
            <ul className="flex items-end justify-end gap-2 pr-4 text-primary">
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Mai
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Raramente
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Talvolta
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Spesso
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Di solito
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Sempre
              </li>
            </ul>
          </FormHeader>
          {QUESTIONS_ONE.map((question, index) => (
            <Item key={index} question={question} />
          ))}
        </>
      )}
      {step === 2 && (
        <section className="space-y-4">
          <>
            <FormHeader>
              <FormInstructions>
                <p className="mb-4 rounded-md bg-white-900 p-4">
                  Troverai qui di seguito una lista di affermazioni. Ti
                  preghiamo di rispondere a tutte le domande selezionando la
                  risposta che meglio ti rispecchia.
                </p>
                <p className="font-bold">
                  Ricorda che non esistono risposte giuste o sbagliate
                </p>
              </FormInstructions>
              <ul className="flex items-end justify-end gap-2 pr-4 text-primary">
                <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                  Mai
                </li>
                <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                  Da una fino a diverse volte al mese
                </li>
                <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                  Una volta alla settimana
                </li>
                <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                  Da due a sei volte alla settimana
                </li>
                <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                  Una volta al giorno
                </li>
                <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                  Più di una volta al giorno
                </li>
              </ul>
            </FormHeader>
            {QUESTIONS_TWO.map((question, index) => (
              <Item key={index} question={question} />
            ))}
          </>
        </section>
      )}

      <FormFooter type="eat-26" className="justify-between">
        {step === 2 ? (
          <>
            <Button type="button" onClick={() => prevStep()}>
              Indietro
            </Button>
            <FormSubmit form={form} onSubmit={onSubmit} />
          </>
        ) : (
          <>
            <Button type="button" onClick={() => prevStep()}>
              Indietro
            </Button>
            <Button type="button" onClick={() => nextStep()}>
              Avanti
            </Button>
          </>
        )}
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
