'use client';

import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import type { FormValues } from '@/features/questionnaires/gad-7/item';
import { Item } from '@/features/questionnaires/gad-7/item';
import { QUESTIONS } from '@/features/questionnaires/gad-7/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

export default function NewAdministrationPage() {
  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;

  return (
    <FormContent<FormValues>
      form={form}
      title="General Anxiety Disorder-7 (GAD-7)"
      viewOnly
    >
      <FormHeader>
        <FormInstructions>
          <p className="mb-4 rounded-md bg-white p-4">
            Nelle <span className="font-bold">ultime 2 settimane</span>, con
            quale frequenza ti hanno dato fastidio ciascuno dei seguenti
            problemi?
          </p>
        </FormInstructions>
        <ul className="text-primary flex items-center justify-end gap-2 pr-4">
          <li className="w-24 text-center text-sm">Mai</li>
          <li className="w-24 text-center text-sm">Alcuni giorni</li>
          <li className="w-24 text-center text-sm">
            Per oltre la metà dei giorni
          </li>
          <li className="w-24 text-center text-sm">Quasi ogni giorno</li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item
          key={index}
          question={question}
          index={index + 1}
          defaultValue={response}
        />
      ))}
    </FormContent>
  );
}
