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
import type { FormValues } from '@/features/questionnaires/honosca/item';
import { Item } from '@/features/questionnaires/honosca/item';
import { QUESTIONS } from '@/features/questionnaires/honosca/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

export default function HONOSCAPage() {
  const { administration, isLoading } = useAdministration<FormValues>();
  const [step, setStep] = useState(1);

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;
  

  const QUESTIONS_ONE = QUESTIONS.slice(0, 13);
  const QUESTIONS_TWO = QUESTIONS.slice(13, 15);

  const nextStep = () => {
    setStep((prev) => (prev === 2 ? prev : prev + 1));
  };

  const prevStep = () => {
    setStep((prev) => (prev === 1 ? prev : prev - 1));
  };
  return (
    <FormContent<FormValues>
      form={form}
      title="Health of the Nation Outcome Scales for Child and Adolescent Mental Health (HoNOSCA)"
      viewOnly
    >
      {step === 1 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p className="text-left text-sm">
                Per ognuna delle seguenti domande, rispondi indicando una fra le
                alternative che meglio descrive la tua esperienza.
              </p>
            </FormInstructions>
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
              <p className="text-left text-sm">
                Per ognuna delle seguenti domande, rispondi indicando una fra le
                alternative che meglio descrive la tua esperienza.
              </p>
            </FormInstructions>
          </FormHeader>
          {QUESTIONS_TWO.map((question, index) => (
            <Item key={index} question={question} defaultValue={response} />
          ))}
        </>
      )}

      <FormFooter type="honosca" className="justify-between">
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
