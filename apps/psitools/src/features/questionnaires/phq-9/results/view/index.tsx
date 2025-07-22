'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormContent,
  FormFooter,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/phq-9/item';
import { Item } from '@/features/questionnaires/phq-9/item';
import { Item2 } from '@/features/questionnaires/phq-9/item2';
import { QUESTIONS } from '@/features/questionnaires/phq-9/questions';

export default function Phq9Page() {
  const [step, setStep] = useState(1);
  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;

  const QUESTIONS_ONE = QUESTIONS.slice(0, 9);
  const QUESTIONS_TWO = QUESTIONS.slice(9, 10);

  const nextStep = () => {
    setStep((prev) => (prev === 2 ? prev : prev + 1));
  };

  const prevStep = () => {
    setStep((prev) => (prev === 1 ? prev : prev - 1));
  };

  return (
    <FormContent<FormValues>
      form={form}
      title="Patient Health Questionnaire 9 (PHQ-9)"
      viewOnly
    >
      {step === 1 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p className="mb-4 rounded-md bg-white p-4">
                Nelle ultime 2 settimane, con quale frequenza ti hanno dato
                fastidio ciascuno dei seguenti problemi? (Seleziona la tua
                risposta)
              </p>
              <p className="px-4 font-bold">
                Non esistono risposte giuste o sbagliate
              </p>
            </FormInstructions>
            <ul className="text-primary flex items-end justify-end gap-2 pr-4">
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Mai
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Alcuni giorni
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Per più della metà dei giorni
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Quasi ogni giorno
              </li>
            </ul>
          </FormHeader>
          {QUESTIONS_ONE.map((question, index) => (
            <Item
              key={index}
              question={question}
              index={index + 1}
              defaultValue={response}
            />
          ))}
        </>
      )}
      {step === 2 && (
        <section className="space-y-4">
          <>
            <FormHeader>
              <FormInstructions>
                <p className="mb-4 rounded-md bg-white p-4">
                  Se hai fatto una crocetta su uno qualsiasi di questi problemi,
                  quanto questi problemi ti hanno reso difficile fare il tuo
                  lavoro, occuparti delle tue cose a casa o avere buoni rapporti
                  con gli altri?
                </p>
                <p className="font-bold">
                  Non esistono risposte giuste o sbagliate
                </p>
              </FormInstructions>
            </FormHeader>
            {QUESTIONS_TWO.map((question, index) => (
              <Item2 key={index} question={question} defaultValue={response} />
            ))}
          </>
        </section>
      )}

      <FormFooter type="phq-9" className="justify-between">
        {step === 2 ? (
          <>
            <Button type="button" onClick={() => prevStep()}>
              Indietro
            </Button>
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
}
