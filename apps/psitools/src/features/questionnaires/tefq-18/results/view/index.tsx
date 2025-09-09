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
import type { FormValues } from '@/features/questionnaires/tefq-18/item';
import { Item } from '@/features/questionnaires/tefq-18/item';
import { Item2 } from '@/features/questionnaires/tefq-18/item2';
import { Item3 } from '@/features/questionnaires/tefq-18/item3';
import { QUESTIONS } from '@/features/questionnaires/tefq-18/questions';

export default function Tefq18Page() {
  const [step, setStep] = useState(1);
  const { administration, isLoading } = useAdministration<FormValues>();
  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;

  const QUESTIONS_ONE = QUESTIONS.slice(0, 13);
  const QUESTIONS_TWO = QUESTIONS.slice(13, 17);
  const QUESTIONS_THREE = QUESTIONS.slice(17, 18);

  const nextStep = () => {
    setStep((prev) => (prev === 2 ? prev : prev + 1));
  };

  const prevStep = () => {
    setStep((prev) => (prev === 1 ? prev : prev - 1));
  };

  return (
    <FormContent<FormValues>
      form={form}
      title="Three Factor Eating Questionnaire-18R (TEFQ-18)"
      viewOnly
    >
      {step === 1 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p>
                Troverà qui di seguito una lista di affermazioni. La preghiamo
                di rispondere a tutte le domande ponendo un segno in
                corrispondenza del valore numerico compreso
                <strong>
                  {' '}
                  tra 1 (COMPLETAMENTE FALSO) e 4 (COMPLETAMENTE VERO){' '}
                </strong>{' '}
                che meglio indica la frequenza con la quale prova o fa
                esperienza delle affermazioni sottostanti.
              </p>
              <p className="font-bold">
                Non esistono risposte giuste o sbagliate.
              </p>
            </FormInstructions>

            <ul className="text-primary flex items-end justify-end gap-2 pr-4">
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Completamente falso
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Prevalentemente falso
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Prevalentemente vero
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Completamente vero
              </li>
            </ul>
          </FormHeader>
          {QUESTIONS_ONE.map((question, index) => (
            <Item key={index} question={question} defaultValue={response} />
          ))}
        </>
      )}

      {step === 2 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p>
                Troverai qui di seguito una lista di affermazioni. Ti preghiamo
                di rispondere a tutte le domande selezionando la risposta che
                meglio indica la frequenza con la quale provi o fai esperienza
                delle affermazioni.
              </p>
              <p className="font-bold">
                Non esistono risposte giuste o sbagliate.
              </p>
            </FormInstructions>
          </FormHeader>
          {QUESTIONS_TWO.map((question, index) => (
            <Item2 key={index} question={question} defaultValue={response} />
          ))}
          {QUESTIONS_THREE.map((question, index) => (
            <Item3 key={index} question={question} defaultValue={response} />
          ))}
        </>
      )}
      <FormFooter type="tefq-18" className="justify-between">
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
