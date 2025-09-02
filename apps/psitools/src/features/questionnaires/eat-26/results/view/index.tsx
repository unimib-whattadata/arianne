'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormContent,
  FormFooter,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import type { FormValues } from '@/features/questionnaires/eat-26/item';
import { formSchema, Item } from '@/features/questionnaires/eat-26/item';
import { QUESTIONS } from '@/features/questionnaires/eat-26/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

export default function NewAdministrationPage() {
  const [step, setStep] = useState(1);

  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  if (!administration || isLoading) return null;

  const { response } = administration.records;

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
      viewOnly
    >
      {step === 1 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p className="mb-4 rounded-md bg-white p-4">
                Troverai qui di seguito una lista di affermazioni. Ti preghiamo
                di rispondere a tutte le domande selezionando la risposta che
                meglio ti rispecchia.
              </p>
              <p className="font-bold">
                Ricorda che non esistono risposte giuste o sbagliate
              </p>
            </FormInstructions>
            <ul className="text-primary flex items-end justify-end gap-2 pr-4">
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
            <Item key={index} question={question} defaultValue={response} />
          ))}
        </>
      )}
      {step === 2 && (
        <section className="space-y-4">
          <>
            <FormHeader>
              <FormInstructions>
                <p className="mb-4 rounded-md bg-white p-4">
                  Troverai qui di seguito una lista di affermazioni. Ti
                  preghiamo di rispondere a tutte le domande selezionando la
                  risposta che meglio ti rispecchia.
                </p>
                <p className="font-bold">
                  Ricorda che non esistono risposte giuste o sbagliate
                </p>
              </FormInstructions>
              <ul className="text-primary flex items-end justify-end gap-2 pr-4">
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
              <Item key={index} question={question} defaultValue={response} />
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
