'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  FormContent,
  FormFooter,
  FormHeader,
  FormInstructions,
  FormSubmit,
} from '@/features/questionnaires/components/form';
import { Item } from '@/features/questionnaires/hcl-32/item';
import { QUESTIONS } from '@/features/questionnaires/hcl-32/questions';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';

import { Item2 } from './item2';
import { Item3 } from './item3';
import type { FormValues } from './schema';
import { formSchema } from './schema';

const NewAdministration = () => {
  const [step, setStep] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const QUESTIONS_TWO_RESPONSE = [
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
    ];

    const calculateScore = (questions: number[]) => {
      return questions.reduce((acc, questionId) => {
        const responseKey = `item-${questionId}`;
        const responseValue = data.response.items[responseKey];

        const parsedValue = responseValue ? parseInt(responseValue, 10) : 0;
        return acc + (isNaN(parsedValue) ? 0 : parsedValue);
      }, 0);
    };

    const itemsNotes = {
      'item-2': data.response.items['response.item-2'] || '',
    };

    return {
      score: calculateScore(QUESTIONS_TWO_RESPONSE),
      response: {
        ...data.response,
        itemsNotes,
      },
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'hcl-32',
  });

  const QUESTIONS_ONE = QUESTIONS.slice(0, 1);
  const QUESTIONS_TWO = QUESTIONS.slice(1, 33);
  const QUESTIONS_THREE = QUESTIONS.slice(33, 34);
  const QUESTIONS_FOUR = QUESTIONS.slice(34, 35);
  const QUESTIONS_FIVE = QUESTIONS.slice(35, 37);
  const QUESTIONS_SIX = QUESTIONS.slice(37, 38);
  const QUESTIONS_SEVEN = QUESTIONS.slice(38, 40);
  const QUESTIONS_EIGHT = QUESTIONS.slice(40, 44);
  const QUESTIONS_NINE = QUESTIONS.slice(44, 48);

  const [steps, setSteps] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);

  useEffect(() => {
    const { unsubscribe } = form.watch((value, { name }) => {
      if (name === 'response.items.item-35') {
        if (value.response?.items?.['item-35'] === 'false') {
          setSteps([1, 2, 3, 4]);
        }
      } else if (name === 'response.items.item-34') {
        if (value.response?.items?.['item-34'] === 'true') {
          setSteps([1, 2, 3, 7]);
        }
      }
    });
    setSteps([1, 2, 3, 4, 5, 6, 7]);

    return () => unsubscribe();
  }, [form]);

  const nextStep = () => {
    setStep((prev) => {
      if (prev + 1 > steps.length - 1) {
        return prev;
      }
      return prev + 1;
    });
  };

  const prevStep = () => {
    setStep((prev) => {
      if (prev === 3) {
        form.setValue('response.items.item-35', 'N/A');
      }
      if (prev - 1 < 0) {
        return prev;
      }
      return prev - 1;
    });
  };

  return (
    <FormContent<FormValues>
      form={form}
      title="HYPOMANIA CHECK LIST-32(HCL-32)"
    >
      {steps[step] === 1 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p>Il livello di energia e di attività e le condizioni dell'umore
                cambiano e oscillano in ciascuno di noi. Ciascuno cioè ha periodi
                in cui si sente "su di giri" e periodi in cui si sente "giù". Questo
                questionario esamina le caratteristiche dei suoi periodi "su".</p>
              <p className="font-bold">
                Per favore, risponda ad ogni domanda facendo un segno sul
                cerchietto accanto alla risposta che più corrisponde alla sua
                opinione o situazione
              </p>
            </FormInstructions>
          </FormHeader>
          {QUESTIONS_ONE.map((question, index) => (
            <Item3 key={index} question={question} />
          ))}
        </>
      )}

      {steps[step] === 2 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p>
                <span className="font-bold">
                  Per favore cerchi di ricordare un periodo in cui era su, in
                  cui stava molto bene. Ci dica se le affermazioni seguenti
                  corrispondono o no a come si sentiva allora,
                </span>
                indipendentemente da come sta adesso.
              </p>
            </FormInstructions>
            <ul className="flex items-end justify-end gap-9 pr-7 text-primary">
              <li className="flex items-center text-sm">Sì</li>
              <li className="flex items-center text-sm">No</li>
            </ul>
          </FormHeader>
          {QUESTIONS_TWO.map((question, index) => (
            <Item index={index + 2} key={index} question={question.text} />
          ))}
        </>
      )}
      {steps[step] === 3 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p>
                <span className="font-bold">
                  Per favore cerchi di ricordare un periodo in cui era su, in
                  cui stava molto bene. Ci dica se le affermazioni seguenti
                  corrispondono o no a come si sentiva allora,
                </span>
                indipendentemente da come sta adesso.
              </p>
            </FormInstructions>
            <ul className="flex items-end justify-end gap-9 pr-7 text-primary">
              <li className="flex items-center text-sm">Sì</li>
              <li className="flex items-center text-sm">No</li>
            </ul>
          </FormHeader>
          {QUESTIONS_THREE.map((question, index) => (
            <Item key={index} index={index + 34} question={question.text} />
          ))}
        </>
      )}
      {steps[step] === 4 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p>
                <span className="font-bold">
                  Per favore cerchi di ricordare un periodo in cui era su, in
                  cui stava molto bene. Ci dica se le affermazioni seguenti
                  corrispondono o no a come si sentiva allora,
                </span>
                indipendentemente da come sta adesso.
              </p>
            </FormInstructions>
            <ul className="flex items-end justify-end gap-9 pr-7 text-primary">
              <li className="flex items-center text-sm">Sì</li>
              <li className="flex items-center text-sm">No</li>
            </ul>
          </FormHeader>
          {QUESTIONS_FOUR.map((question, index) => (
            <Item key={index} index={index + 35} question={question.text} />
          ))}
        </>
      )}
      {steps[step] === 5 && (
        <>
          <FormHeader></FormHeader>
          <div className="mb-4 rounded-md bg-slate-100 p-4">
            {QUESTIONS_FIVE.map((question, index) => (
              <Item2 key={index} question={question} />
            ))}
          </div>
          {QUESTIONS_SIX.map((question, index) => (
            <Item3 key={index} question={question} />
          ))}
          <FormHeader></FormHeader>
          <div className="mb-4 rounded-md bg-slate-100 p-4">
            <p className="pb-2 text-sm">
              E quanto è durato il periodo più lungo di questo tipo (in mesi e
              giorni)?
            </p>

            {QUESTIONS_SEVEN.map((question, index) => (
              <Item2 key={index} question={question} />
            ))}
          </div>
        </>
      )}
      {steps[step] === 6 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p>
                Quali sono state le conseguenze del suo essere “su di giri” sui
                seguenti aspetti della sua vita
              </p>
            </FormInstructions>
          </FormHeader>
          {QUESTIONS_EIGHT.map((question, index) => (
            <Item3 key={index} question={question} />
          ))}
        </>
      )}
      {steps[step] === 7 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p>
                La preghiamo di dirci ora se le seguenti affermazioni la
                descrivono bene o no come è di solito, indipendentemente da come
                sta adesso
              </p>
            </FormInstructions>
            <ul className="flex items-end justify-end gap-9 pr-7 text-primary">
              <li className="flex items-center text-sm">Sì</li>
              <li className="flex items-center text-sm">No</li>
            </ul>
          </FormHeader>
          {QUESTIONS_NINE.map((question, index) => (
            <Item key={index} index={index + 45} question={question.text} />
          ))}
        </>
      )}

      <FormFooter type="hcl-32" className="justify-between">
        {step === steps.length - 1 ? (
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
