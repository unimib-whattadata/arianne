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
import { Item } from '@/features/questionnaires/ede-q/item';
import { Item2 } from '@/features/questionnaires/ede-q/item2';
import { Item3 } from '@/features/questionnaires/ede-q/item3';
import { Item4 } from '@/features/questionnaires/ede-q/item4';
import { QUESTIONS } from '@/features/questionnaires/ede-q/questions';
import type { FormValues } from '@/features/questionnaires/ede-q/schema';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

export default function EdeQPage() {
  const [step, setStep] = useState(1);
  const { administration, isLoading } = useAdministration<FormValues>();
  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;

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
      viewOnly
    >
      {step === 1 && (
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
                Domande da 1 a 12. Metta un cerchio nel numero appropriato sulla
                destra. Ricordi che le domande si riferiscono solo alle ultime
                quattro settimane (28 giorni).{' '}
              </p>
            </FormInstructions>

            <ul className="text-primary flex items-end justify-end gap-2 pr-4">
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
            <Item key={index} question={question} defaultValue={response} />
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
            <Item2
              key={index}
              question={question}
              defaultValue={response.notes[`note-${question.index}`]}
            />
          ))}
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
            <Item3 key={index} question={question} defaultValue={response} />
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

            <ul className="text-primary flex items-end justify-end gap-14 pr-4">
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
            <Item4 key={index} question={question} defaultValue={response} />
          ))}
        </>
      )}

      <FormFooter type="ede-q" className="justify-between">
        {step === 4 ? (
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
