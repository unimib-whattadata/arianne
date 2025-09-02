'use client';

import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/mec-10/item';
import { Item } from '@/features/questionnaires/mec-10/item';
import { QUESTIONS } from '@/features/questionnaires/mec-10/questions';

export default function NewAdministrationPage() {
  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;

  return (
    <FormContent<FormValues>
      form={form}
      title="Italian Measure of Eating Compulsivity (MEC10-IT)"
      viewOnly
    >
      <FormHeader>
        <FormInstructions>
          <p className="mb-4 rounded-md bg-white p-4">
            La preghiamo di rispondere a tutte le domande ponendo un segno in
            corrispondenza del valore numerico – compreso tra 0 (COMPLETAMENTE
            FALSO) e 4 (COMPLETAMENTE VERO) – che meglio La rappresenta.
          </p>
          <p className="font-bold">Non esistono risposte giuste o sbagliate</p>
        </FormInstructions>
        <ul className="text-primary flex items-center justify-end gap-2 pr-4">
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Completamente falso
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Falso
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Né vero, né falso
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Vero
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Completamente vero
          </li>
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
