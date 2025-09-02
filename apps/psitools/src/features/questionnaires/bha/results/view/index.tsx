'use client';

import { useForm } from 'react-hook-form';

import type { FormValues } from '@/features/questionnaires/bha/item';
import { Item } from '@/features/questionnaires/bha/item';
import { QUESTIONS } from '@/features/questionnaires/bha/questions';
import {
  FormContent,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

export default function BHAPage() {
  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;

  return (
    <FormContent<FormValues>
      form={form}
      title="Brief Assessment of Hopelessness (BAH)"
      viewOnly
    >
      <FormHeader>
        <FormInstructions>
          <p className="pb-4">
            Per favore legga attentamente una alla volta le 7 affermazioni del
            presente questionario. Se l'affermazione descrive i Suoi
            atteggiamenti nell'ambito degli ultimi 7 giorni, indichi la casella
            nella colonna "VERO" accanto all'affermazione. Se invece
            l'affermazione NON descrive i Suoi atteggiamenti, indichi la casella
            nella colonna "FALSO".
          </p>
          <p> Si accerti di leggere ogni affermazione attentamente.</p>
        </FormInstructions>
        <div className="flex justify-end">
          <ul className="text-primary mr-4 flex gap-2">
            <li className="flex w-10 items-center text-sm">Vero</li>
            <li className="flex w-10 items-center text-sm">Falso</li>
          </ul>
        </div>
      </FormHeader>
      {QUESTIONS.map((question) => {
        return (
          <Item
            key={question.index}
            question={question.text}
            index={question.index}
            defaultValue={response}
          />
        );
      })}
    </FormContent>
  );
}
