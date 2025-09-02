'use client';

import type { JsonObject } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import type { FormValues } from '@/features/questionnaires/dass-21/item';
import { Item } from '@/features/questionnaires/dass-21/item';
import { QUESTIONS } from '@/features/questionnaires/dass-21/questions';
import { useTRPC } from '@/trpc/react';
import type { TView } from '@/types/view-types';

export default function IusRPage() {
  const { view } = useParams<{ view: TView }>();
  const [_, idTest] = view;

  const api = useTRPC();

  const {
    data: administration,
    isLoading,
    isFetching,
  } = useQuery(
    api.administrations.findUnique.queryOptions(
      { id: idTest },
      {
        enabled: !!idTest,
        select: (data) => data.administration,
      },
    ),
  );

  const records = administration?.records as JsonObject;
  const response = records.response as Record<string, string>;

  const form = useForm<FormValues>();
  if (!records) return null;
  if (!response || isLoading || isFetching) return null;

  return (
    <FormContent<FormValues>
      form={form}
      title="Depression Anxiety Stress Scales 21 (DASS-21)"
      viewOnly
    >
      <FormHeader>
        <FormInstructions>
          <p className="mb-4 rounded-md bg-white p-4">
            Per favore, legga ogni frase e poi indichi con quale frequenza la
            situazione descritta si è verificata negli ultimi sette giorni.
            Esprima la sua valutazione selezionando il valore sulla destra.
            Tenga presente che non esistono risposte giuste o sbagliate. Non
            impieghi troppo tempo per rispondere a ciascuna affermazione, spesso
            la prima risposta è la più accurata. Grazie per la sua preziosa
            disponibilità e collaborazione.
          </p>
          <p className="font-h3 absolute top-80 -right-32 z-20 rotate-90">
            (sola visualizzazione)
          </p>
          <ul className="text-primary flex items-end justify-end gap-2 pr-4">
            <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
              Non mi è mai accaduto
            </li>
            <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
              Mi è capitato qualche volta
            </li>
            <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
              Mi è capitato con una certa frequenza
            </li>
            <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
              Mi è capitato spesso
            </li>
          </ul>
        </FormInstructions>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} defaultValue={response} />
      ))}
    </FormContent>
  );
}
