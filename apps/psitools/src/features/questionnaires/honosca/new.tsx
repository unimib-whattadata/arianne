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
import {
  formSchema as formSchemaItem,
  Item,
} from '@/features/questionnaires/honosca/item';
import {
  INSTRUCTIONS,
  QUESTIONS,
} from '@/features/questionnaires/honosca/questions';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';

const formSchema = extendWithTherapistData(formSchemaItem);
type FormValues = z.infer<typeof formSchema>;

const NewAdministration = () => {
  const [step, setStep] = useState(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const totalScore = Object.values(data.response).reduce(
      (acc, value) => acc + parseInt(value),
      0,
    );

    return {
      response: data.response,
      totalScore,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'honosca',
  });

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
    >
      {step === 1 && (
        <>
          <FormHeader className="pb-4">
            <FormInstructions>
              <p className="text-left text-sm">{INSTRUCTIONS}</p>
            </FormInstructions>
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
              <p className="text-left text-sm">
                Per ognuna delle seguenti domande, rispondi indicando una fra le
                alternative che meglio descrive la tua esperienza.
              </p>
            </FormInstructions>
          </FormHeader>
          {QUESTIONS_TWO.map((question, index) => (
            <Item key={index} question={question} />
          ))}
        </>
      )}
      <FormFooter type="honosca" className="justify-between">
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
