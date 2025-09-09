'use client';

import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/pq-16/item';
import { PQ16Item } from '@/features/questionnaires/pq-16/item';
import { QUESTIONS } from '@/features/questionnaires/pq-16/questions';

export default function PQ16Page() {
  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;

  return (
    <FormContent
      form={form}
      title="Questionario dei sintomi prodromici (PQ-16)"
      viewOnly
    >
      <FormHeader>
        <FormInstructions>
          Il questionario esplora aspetti di pensieri, sentimenti ed esperienze.
          Per ogni affermazione indica se sei d&apos;accordo o in disaccordo,
          selezionando VERO o FALSO sulla destra. Nel caso tu risponda
          &quot;vero&quot;, indica nell&apos;ultima colonna il livello di
          disagio associato (nessuno=0; lieve=1; moderato=2; grave=3).
        </FormInstructions>
        <div className="flex justify-end">
          <ul className="text-primary mr-12 flex gap-2">
            <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
              Vero
            </li>
            <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
              Falso
            </li>
          </ul>
          <ul className="text-primary flex gap-2 pr-4">
            <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
              Nessuno
            </li>
            <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
              Lieve
            </li>
            <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
              Moderato
            </li>
            <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
              Grave
            </li>
          </ul>
        </div>
      </FormHeader>
      {QUESTIONS.map((question) => {
        return (
          <PQ16Item
            key={question.index}
            question={question.text}
            index={question.index}
            defaultValue={response?.[`item-${question.index}`]?.value}
            defaultScore={response?.[`item-${question.index}`]?.score}
          />
        );
      })}
    </FormContent>
  );
}
