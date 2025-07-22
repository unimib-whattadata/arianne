'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import type { FormValues } from '@/features/questionnaires/aebs/item';
import { Item } from '@/features/questionnaires/aebs/item';
import { QUESTIONS } from '@/features/questionnaires/aebs/questions';
import {
  FormContent,
  FormFooter,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

export default function NewAdministrationPage() {
  const [step, setStep] = useState(1);

  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;

  const QUESTIONS_ONE = QUESTIONS.slice(0, 9);
  const QUESTIONS_TWO = QUESTIONS.slice(9, 15);

  const nextStep = () => {
    setStep((prev) => (prev === 2 ? prev : prev + 1));
  };

  const prevStep = () => {
    setStep((prev) => (prev === 1 ? prev : prev - 1));
  };

  return (
    <FormContent<FormValues>
      form={form}
      title="Addiction-like Eating Behaciors Scale (AEBS)"
      viewOnly
    >
      {step === 1 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p className="mb-4 rounded-md bg-white p-4">
                Questo questionario contiene una serie di affermazioni relative
                ad atteggiamenti, sentimenti o comportamenti legati al cibo, di
                cui le persone possono fare esperienza. Segna la risposta che
                meglio ti descrive.
              </p>
              <p className="font-bold">
                Non esistono risposte giuste o sbagliate
              </p>
            </FormInstructions>
            <ul className="text-primary flex items-end justify-end gap-2 pr-4">
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Mai/Quasi mai
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Qualche volta
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Metà delle volte
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Il più delle volte
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Quasi sempre/Sempre
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
                  Questo questionario contiene una serie di affermazioni
                  relative ad atteggiamenti, sentimenti o comportamenti legati
                  al cibo, di cui le persone possono fare esperienza. Segna la
                  risposta che meglio ti descrive.
                </p>
                <p className="font-bold">
                  Non esistono risposte giuste o sbagliate
                </p>
              </FormInstructions>
              <ul className="text-primary flex items-end justify-end gap-2 pr-4">
                <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                  Fortemente in disaccordo
                </li>
                <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                  In disaccordo
                </li>
                <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                  Né in accordo, né in disaccordo
                </li>
                <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                  In accordo
                </li>
                <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                  Fortemente in accordo
                </li>
              </ul>
            </FormHeader>
            {QUESTIONS_TWO.map((question, index) => (
              <Item key={index} question={question} defaultValue={response} />
            ))}
          </>
        </section>
      )}
      <FormFooter type="aebs" className="justify-between">
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
