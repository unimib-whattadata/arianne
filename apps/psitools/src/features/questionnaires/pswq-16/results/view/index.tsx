'use client';

import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/pswq-16/item';
import { Item } from '@/features/questionnaires/pswq-16/item';
import { QUESTIONS } from '@/features/questionnaires/pswq-16/questions';

export default function IusRPage() {
  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;

  return (
    <FormContent
      form={form}
      title="Penn State Worry Questionnaire (PSWQ-16)"
      viewOnly
    >
      <FormHeader>
        <FormInstructions>
          Per favore leggi attentamente ogni affermazione e valuta quanto ti
          trovi in accordo con essa, selezionando la casella appropriata nello
          spazio apposito accanto a ciascuna affermazione. È importante
          ricordare che non ci sono risposte giuste o sbagliate. Non soffermarti
          troppo su ogni affermazione: la prima risposta è spesso la più
          accurata.
        </FormInstructions>
        <ul className="text-primary flex items-end justify-end gap-2 pr-4">
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Per nulla d'accordo
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Un poco d'accordo
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Abbastanza d'accordo
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Molto d'accordo
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Completamente d'accordo
          </li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} defaultValue={response} />
      ))}
    </FormContent>
  );
}
