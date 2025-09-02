'use client';

import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import type { FormValues } from '@/features/questionnaires/gss/item';
import { Item } from '@/features/questionnaires/gss/item';
import { QUESTIONS } from '@/features/questionnaires/gss/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

export default function GSSPage() {
  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;

  const newResponse: Record<string, string> = {};

  for (const key in response) {
    let value = parseInt(response[key]);

    if (key === 'item-1' || key === 'item-5' || key === 'item-8') {
      value -= 7;
    } else {
      value -= 1;
    }

    newResponse[key] = Math.abs(value).toString();
  }

  return (
    <FormContent<FormValues>
      form={form}
      title="Guilt Sensitivity Scale (GSS)"
      viewOnly
    >
      <FormHeader>
        <FormInstructions>
          <p className="font-bold">Istruzioni</p>
          <p>
            Qui sotto troverà una lista di affermazioni. Valuti quanto ciascuna
            di esse è vera per lei. Utilizzi i criteri della scala sotto
            riportata per esprimere quanto, "mai" a "sempre", ogni affermazione
            sia vera per lei.
          </p>
        </FormInstructions>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} defaultValue={newResponse} />
      ))}
    </FormContent>
  );
}
