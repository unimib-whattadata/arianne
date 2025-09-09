'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  FormContent,
  FormFooter,
  FormHeader,
  FormInstructions,
  FormSubmit,
} from '@/features/questionnaires/components/form';
import { extendWithTherapistData } from '@/features/questionnaires/components/therapist-schema';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';
import {
  formSchema as formSchemaItem,
  Item,
} from '@/features/questionnaires/tefq-18/item';
import {
  INSTRUCTIONS_1,
  INSTRUCTIONS_2,
  QUESTIONS,
} from '@/features/questionnaires/tefq-18/questions';

import { Item2 } from './item2';
import { Item3 } from './item3';

const formSchema = extendWithTherapistData(formSchemaItem);
type FormValues = z.infer<typeof formSchema>;

const NewAdministration = () => {
  const [step, setStep] = useState(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const UE_QUESTIONS = [1, 4, 5, 7, 8, 9, 13, 14, 17];
    const CR_QUESTIONS = [2, 11, 12, 15, 16, 18];
    const EE_QUESTIONS = [3, 6, 10];

    const calculateScore = (questions: number[]) =>
      +Object.values(data.response).reduce((acc, curr, index) => {
        if (questions.includes(index + 1)) {
          return `${parseInt(acc) + parseInt(curr)}`;
        }
        return acc;
      }, '0');

    return {
      score: {
        UE: calculateScore(UE_QUESTIONS),
        CR: calculateScore(CR_QUESTIONS),
        EE: calculateScore(EE_QUESTIONS),
      },
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'tefq-18',
  });

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
    >
      {step === 1 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p>
                {/* Troverà qui di seguito una lista di affermazioni. La preghiamo
                di rispondere a tutte le domande ponendo un segno in
                corrispondenza del valore numerico compreso
                <strong>
                  {' '}
                  tra 1 (COMPLETAMENTE FALSO) e 4 (COMPLETAMENTE VERO){' '}
                </strong>{' '}
                che meglio indica la frequenza con la quale prova o fa
                esperienza delle affermazioni sottostanti. */}
                {INSTRUCTIONS_1}
              </p>
            </FormInstructions>

            <ul className="flex items-end justify-end gap-2 pr-4 text-primary">
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
            <Item key={index} question={question} />
          ))}
        </>
      )}

      {step === 2 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p>{INSTRUCTIONS_2}</p>
              <p className="font-bold">
                Non esistono risposte giuste o sbagliate.
              </p>
            </FormInstructions>
          </FormHeader>
          {QUESTIONS_TWO.map((question, index) => (
            <Item2 key={index} question={question} />
          ))}
          {QUESTIONS_THREE.map((question, index) => (
            <Item3 key={index} question={question} />
          ))}
        </>
      )}

      <FormFooter type="tefq-18" className="justify-between">
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
