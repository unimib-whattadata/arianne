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
import { Item } from '@/features/questionnaires/hcl-32/item';
import { Item2 } from '@/features/questionnaires/hcl-32/item2';
import { Item3 } from '@/features/questionnaires/hcl-32/item3';
import { QUESTIONS } from '@/features/questionnaires/hcl-32/questions';
import type { FormValues } from '@/features/questionnaires/hcl-32/schema';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

export default function Hcl32Page() {
  const { administration, isLoading } = useAdministration<FormValues>();
  const [step, setStep] = useState(1);

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const QUESTIONS_ONE = QUESTIONS.slice(0, 1);
  const QUESTIONS_TWO = QUESTIONS.slice(1, 33);
  const QUESTIONS_THREE = QUESTIONS.slice(33, 34);
  const QUESTIONS_FOUR = QUESTIONS.slice(34, 35);
  const QUESTIONS_FIVE = QUESTIONS.slice(35, 37);
  const QUESTIONS_SIX = QUESTIONS.slice(37, 38);
  const QUESTIONS_SEVEN = QUESTIONS.slice(38, 40);
  const QUESTIONS_EIGHT = QUESTIONS.slice(40, 44);
  const QUESTIONS_NINE = QUESTIONS.slice(44, 48);

  const nextStep = () => {
    setStep((prev) => (prev === 7 ? prev : prev + 1));
  };

  const prevStep = () => {
    setStep((prev) => (prev === 1 ? prev : prev - 1));
  };
  
  const { response } = administration.records;
  
  return (
    <FormContent<FormValues>
      form={form}
      title="HYPOMANIA CHECK LIST-32(HCL-32)"
      viewOnly
    >
      {step === 1 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p>
                Il livello di energia e di attività e le condizioni dell’umore
                cambiano e oscillano in ciascuno di noi. Ciascuno cioè ha
                periodi in cui si sente “su di giri” e periodi in cui si sente
                “giù”. Questo questionario esamina le caratteristiche dei suoi
                periodi “su”.
              </p>
              <p className="font-bold">
                Per favore, risponda ad ogni domanda facendo un segno sul
                cerchietto accanto alla risposta che più corrisponde alla sua
                opinione o situazione
              </p>
            </FormInstructions>
          </FormHeader>
          {QUESTIONS_ONE.map((question, index) => (
            <Item3 key={index} question={question} defaultValue={response} />
          ))}
        </>
      )}

      {step === 2 && (
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
            <ul className="text-primary flex items-end justify-end gap-9 pr-7">
              <li className="flex items-center text-sm">Sì</li>
              <li className="flex items-center text-sm">No</li>
            </ul>
          </FormHeader>
          {QUESTIONS_TWO.map((question, index) => (
            <Item
              index={index + 2}
              key={index}
              question={question.text}
              defaultValue={response}
            />
          ))}
        </>
      )}
      {step === 3 && (
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
            <ul className="text-primary flex items-end justify-end gap-9 pr-7">
              <li className="flex items-center text-sm">Sì</li>
              <li className="flex items-center text-sm">No</li>
            </ul>
          </FormHeader>
          {QUESTIONS_THREE.map((question, index) => (
            <Item
              key={index}
              index={index + 34}
              question={question.text}
              defaultValue={response}
            />
          ))}
        </>
      )}
      {step === 4 && (
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
            <ul className="text-primary flex items-end justify-end gap-9 pr-7">
              <li className="flex items-center text-sm">Sì</li>
              <li className="flex items-center text-sm">No</li>
            </ul>
          </FormHeader>
          {QUESTIONS_FOUR.map((question, index) => (
            <Item
              key={index}
              index={index + 35}
              question={question.text}
              defaultValue={response}
            />
          ))}
        </>
      )}
      {step === 5 && (
        <>
          <FormHeader></FormHeader>
          <div className="mb-4 rounded-md bg-slate-100 p-4">
            {QUESTIONS_FIVE.map((question, index) => (
              <Item2
                key={index}
                question={question}
                defaultValue={response.items[`item-${question.index}`]}
              />
            ))}
          </div>
          {QUESTIONS_SIX.map((question, index) => (
            <Item3 key={index} question={question} defaultValue={response} />
          ))}
          <div className="mb-4 rounded-md bg-slate-100 p-4">
            <p className="pb-2 text-sm">
              E quanto è durato il periodo più lungo di questo tipo (in mesi e
              giorni)?
            </p>

            {QUESTIONS_SEVEN.map((question, index) => (
              <Item2
                key={index}
                question={question}
                defaultValue={response.items[`item-${question.index}`]}
              />
            ))}
          </div>
        </>
      )}
      {step === 6 && (
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
            <Item3 key={index} question={question} defaultValue={response} />
          ))}
        </>
      )}
      {step === 7 && (
        <>
          <FormHeader>
            <FormInstructions>
              <p>
                La preghiamo di dirci ora se le seguenti affermazioni la
                descrivono bene o no come è di solito, indipendentemente da come
                sta adesso
              </p>
            </FormInstructions>
            <ul className="text-primary flex items-end justify-end gap-9 pr-7">
              <li className="flex items-center text-sm">Sì</li>
              <li className="flex items-center text-sm">No</li>
            </ul>
          </FormHeader>
          {QUESTIONS_NINE.map((question, index) => (
            <Item
              key={index}
              index={index + 45}
              question={question.text}
              defaultValue={response}
            />
          ))}
        </>
      )}

      <FormFooter type="hcl-32" className="justify-between">
        {step === 7 ? (
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
