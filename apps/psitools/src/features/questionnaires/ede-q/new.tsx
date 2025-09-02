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
import { Item } from '@/features/questionnaires/ede-q/item';
import {
  INSTRUCTIONS,
  QUESTIONS,
} from '@/features/questionnaires/ede-q/questions';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';

import { Item2 } from './item2';
import { Item3 } from './item3';
import { Item4 } from './item4';
import { formSchema as formSchemaItem } from './schema';

const formSchema = extendWithTherapistData(formSchemaItem);

type FormValues = z.infer<typeof formSchema>;
const NewAdministration = () => {
  const [step, setStep] = useState(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const R_QUESTIONS = [1, 2, 3, 4, 5];
    const PA_QUESTIONS = [7, 9, 19, 20, 21];
    const PFC_QUESTIONS = [6, 8, 10, 11, 23, 26, 27, 28];
    const PP_QUESTIONS = [8, 12, 22, 24, 25];
    const OPEN_QUESTIONS = [13, 14, 15, 16, 17, 18];

    const calculateScore = (questions: number[]) => {
      return questions.reduce((acc, questionId) => {
        const responseKey = `item-${questionId}`;
        const responseValue = data.response.items[responseKey];

        const parsedValue = responseValue ? parseInt(responseValue, 10) : 0;
        return acc + (isNaN(parsedValue) ? 0 : parsedValue);
      }, 0);
    };

    return {
      score: {
        R: calculateScore(R_QUESTIONS),
        PA: calculateScore(PA_QUESTIONS),
        PFC: calculateScore(PFC_QUESTIONS),
        PP: calculateScore(PP_QUESTIONS),
        OPEN: calculateScore(OPEN_QUESTIONS),
      },
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'ede-q',
  });

  const QUESTIONS_ONE = QUESTIONS.slice(0, 12);
  const QUESTIONS_TWO = QUESTIONS.slice(12, 18);
  const QUESTIONS_THREE = QUESTIONS.slice(18, 21);
  const QUESTIONS_FOUR = QUESTIONS.slice(21, 28);

  const nextStep = () => {
    setStep((prev) => (prev === 4 ? prev : prev + 1));
  };

  const prevStep = () => {
    setStep((prev) => (prev === 1 ? prev : prev - 1));
  };

  return (
    <FormContent<FormValues>
      form={form}
      title="Eating Disorder Examination Questionnaire (EDE-Q)"
    >
      {step === 1 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p>{INSTRUCTIONS}</p>
              <p className="font-bold">
                Domande da 1 a 12. Metta un cerchio nel numero appropriato sulla
                destra. Ricordi che le domande si riferiscono solo alle ultime
                quattro settimane (28 giorni).{' '}
              </p>
            </FormInstructions>

            <ul className="flex items-end justify-end gap-2 pr-4 text-primary">
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Mai
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                1-5 giorni
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                6-12 giorni
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                13-15 giorni
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                16-22 giorni
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                23-27 giorni
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Ogni giorno
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
              <p>
                Domande da 13 a 18. Metta il numero appropriato nel riquadro
                sulla destra. Si ricordi che le domande si riferiscono alle
                ultime quattro settimane (28 giorni).
              </p>
              <p className="font-bold">
                Non esistono risposte giuste o sbagliate.
              </p>
            </FormInstructions>
          </FormHeader>
          {QUESTIONS_TWO.map((question, index) => (
            <Item2 key={index} question={question} />
          ))}
          {/* {QUESTIONS_THREE.map((question, index) => (
            <Item3 key={index} question={question} />
          ))} */}
        </>
      )}
      {step === 3 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p>
                Istruzioni. Le seguenti domande riguardano le ultime quattro
                settimane (28 giorni). È pregato di leggere ogni domanda
                attentamente. La preghiamo di rispondere a tutte le domande.
                Grazie
              </p>
              <p className="font-bold">
                Metta un cerchio nel numero appropriato. Noti che il termine
                “abbuffata” significa il mangiare quello che altri
                considererebbero una quantità di cibo insolitamente elevata di
                cibo, accompagnata dal senso di avere perso il controllo
                sull’alimentazione.
              </p>
            </FormInstructions>
          </FormHeader>
          {QUESTIONS_THREE.map((question, index) => (
            <Item3 key={index} question={question} />
          ))}
        </>
      )}
      {step === 4 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p>
                Istruzioni. Le seguenti domande riguardano le ultime quattro
                settimane (28 giorni). È pregato di leggere ogni domanda
                attentamente. La preghiamo di rispondere a tutte le domande.
                Grazie
              </p>
              <p className="font-bold">
                Domande da 22 a 28. Metta un cerchio nel numero appropriato
                sulla destra.
              </p>
            </FormInstructions>

            <ul className="flex items-end justify-end gap-14 pr-4 text-primary">
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Per niente
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Leggermente
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Moderatame
              </li>
              <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
                Notevolmente
              </li>
            </ul>
          </FormHeader>
          {QUESTIONS_FOUR.map((question, index) => (
            <Item4 key={index} question={question} />
          ))}
        </>
      )}

      <FormFooter type="ede-q" className="justify-between">
        {step === 4 ? (
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
