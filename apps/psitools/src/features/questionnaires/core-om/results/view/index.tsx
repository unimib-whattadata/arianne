'use client';

import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import type { FormValues } from '@/features/questionnaires/core-om/item';
import { Item } from '@/features/questionnaires/core-om/item';
import { QUESTIONS } from '@/features/questionnaires/core-om/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

export default function IusRPage() {
  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;

  return (
    <FormContent<FormValues>
      form={form}
      title="Clinical Outcomes in Routine Evaluation - Outcome Measure (CORE - OM)"
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

        <ul className="text-primary flex justify-end gap-2 pr-4">
          <li className="w-20 text-center text-sm">Per nulla</li>
          <li className="w-20 text-center text-sm">Solo Occasionalmente</li>
          <li className="w-20 text-center text-sm">Ogni tanto</li>
          <li className="w-20 text-center text-sm">Spesso</li>
          <li className="w-20 text-center text-sm">Molto Spesso o sempre</li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} defaultValue={response} />
      ))}
    </FormContent>
  );
}
