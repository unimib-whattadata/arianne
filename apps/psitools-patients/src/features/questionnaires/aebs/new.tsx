import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import type { FormValues } from '@/features/questionnaires/aebs/item';
import { formSchema, Item } from '@/features/questionnaires/aebs/item';
import { QUESTIONS } from '@/features/questionnaires/aebs/questions';
import {
  FormContent,
  FormFooter,
  FormHeader,
  FormInstructions,
  FormSubmit,
} from '@/features/questionnaires/components/form';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';

const NewAdministration = () => {
  const [step, setStep] = useState(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    return {
      score: {
        appetiteDrive: +Object.values(data.response).reduce(
          (acc, curr, index) => {
            if (index < 9) return `${parseInt(acc) + parseInt(curr)}`;
            return acc;
          },
        ),
        lowDietaryControl: +Object.values(data.response).reduce(
          (acc, curr, index) => {
            if (index >= 9) return `${parseInt(acc) + parseInt(curr)}`;
            return acc;
          },
          '0',
        ),
      },
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'aebs',
  });

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
      title="Addiction-like Eating Behaviors Scale (AEBS-IT)"
    >
      {step === 1 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p className="mb-4 rounded-md bg-white-900 p-4">
                Questo questionario contiene una serie di affermazioni relative
                ad atteggiamenti, sentimenti o comportamenti legati al cibo, di
                cui le persone possono fare esperienza. Segna la risposta che
                meglio ti descrive.
              </p>
              <p className="font-bold">
                Non esistono risposte giuste o sbagliate
              </p>
            </FormInstructions>
            <ul className="flex items-end justify-end gap-2 pr-4 text-primary">
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
                  Questo questionario contiene una serie di affermazioni
                  relative ad atteggiamenti, sentimenti o comportamenti legati
                  al cibo, di cui le persone possono fare esperienza. Segna la
                  risposta che meglio ti descrive.
                </p>
                <p className="font-bold">
                  Non esistono risposte giuste o sbagliate
                </p>
              </FormInstructions>
              <ul className="flex items-end justify-end gap-2 pr-4 text-primary">
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
              <Item key={index} question={question} />
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
