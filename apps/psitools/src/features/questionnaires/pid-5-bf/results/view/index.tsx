'use client';

import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/pid-5-bf/item';
import { Item } from '@/features/questionnaires/pid-5-bf/item';
import { QUESTIONS } from '@/features/questionnaires/pid-5-bf/questions';

export default function PID5BFPage() {
  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;
  const { response } = administration.records;

  return (
    <FormContent<FormValues>
      form={form}
      title="Inventario di personalità per il DSM-5 – Versione breve (PID-5-BF) "
      viewOnly
    >
      <FormHeader>
        <FormInstructions>
          <p className="rounded-md bg-white p-4">
            Questo è un elenco di affermazioni che persone differenti potrebbero
            fare a proposito di loro stesse. Siamo interessati a sapere in quale
            modo lei si descriverebbe. Non ci sono risposte “giuste” o
            “sbagliate”. Quindi, cerchi di descriversi nel modo più sincero
            possibile; considereremo le sue risposte confidenziali.
          </p>
          <p className="p-4 font-bold">
            La invitiamo a usare tutto il tempo che le è necessario e a leggere
            attentamente ciascuna affermazione, scegliendo la risposta che la
            descrive nel modo migliore.
          </p>
        </FormInstructions>
        <ul className="text-primary flex items-end justify-end gap-2 pr-4">
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Sempre o spesso falso
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Talvolta o abbastanza falso
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Talvolta o abbastanza vero
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Sempre o spesso vero
          </li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} defaultValue={response} />
      ))}
    </FormContent>
  );
}
