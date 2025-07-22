'use client';

import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/sps/item';
import { Item } from '@/features/questionnaires/sps/item';
import { QUESTIONS } from '@/features/questionnaires/sps/questions';

export default function NewAdministrationPage() {
  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;

  return (
    <FormContent<FormValues>
      form={form}
      title="Social Phobia Scale (SPS)"
      viewOnly
    >
      <FormHeader>
        <FormInstructions>
          <p className="mb-4 rounded-md bg-white p-4">
            Le affermazioni si riferiscono a situazioni ed esperienze che
            possono provocare disagio e ansia. Legga ogni frase e indichi quanto
            bene descrive la sua esperienza, mettendo una crocetta sulla colonna
            adatta.
          </p>
        </FormInstructions>
        <ul className="text-primary flex items-end justify-end gap-2 pr-4">
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Per nulla
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Un poco
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Abbastanza
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Molto
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Moltissimo
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
