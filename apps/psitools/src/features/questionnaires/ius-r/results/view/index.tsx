'use client';

import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/ius-r/item';
import { Item } from '@/features/questionnaires/ius-r/item';
import { QUESTIONS } from '@/features/questionnaires/ius-r/questions';

export default function IusRPage() {
  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;
  
  return (
    <FormContent<FormValues>
      form={form}
      title="Intolerance of Uncertainty Scale-Revised (IUS-R)"
      viewOnly
    >
      <FormHeader>
        <FormInstructions>
          <p>
            Di seguito troverà una serie di affermazioni. La preghiamo di
            leggere attentamente ciascuna affermazione e di indicare quella che
            meglio la descrive.
          </p>
        </FormInstructions>
        <ul className="text-primary flex items-end justify-end gap-2 pr-4">
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Per niente d&apos;accordo
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Un po&apos; d&apos;accordo
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Moderatamente d&apos;accordo
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Molto d&apos;accordo
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Completamente d&apos;accordo
          </li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} defaultValue={response} />
      ))}
    </FormContent>
  );
}
