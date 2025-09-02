'use client';

import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import type { FormValues } from '@/features/questionnaires/haq/item';
import { Item } from '@/features/questionnaires/haq/item';
import { QUESTIONS } from '@/features/questionnaires/haq/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

export default function IusRPage() {
  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;

  return (
    <FormContent<FormValues>
      form={form}
      title="Health Anxiety Questionnaire (HAQ)"
      viewOnly
    >
      <FormHeader>
        <FormInstructions>
          <p>
            Le seguenti domande si riferiscono alle preoccupazioni per la
            salute. Legga attentamente ogni domanda e indichi con che frequenza
            è stato disturbato durante <strong> l’ultima settimana</strong>,
            mettendo una crocetta nelle colonne accanto a ciascuna domanda.
          </p>
        </FormInstructions>
        <ul className="text-primary flex items-end justify-end gap-2 pr-4">
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Mai o Raramente
          </li>
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Qualche volta
          </li>
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Spesso
          </li>
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Per la maggior parte del tempo
          </li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} defaultValue={response} />
      ))}
    </FormContent>
  );
}
