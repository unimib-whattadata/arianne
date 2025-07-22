'use client';

import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormHeader,
} from '@/features/questionnaires/components/form';
import type { FormValues } from '@/features/questionnaires/hads/item';
import { Item } from '@/features/questionnaires/hads/item';
import { QUESTIONS } from '@/features/questionnaires/hads/questions';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';

export default function HadsPage() {
  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;
  const { response } = administration.records;

  return (
    <FormContent<FormValues>
      form={form}
      title="Hospital anxiety and depression scale (HADS)"
      viewOnly
    >
      <FormHeader />
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} defaultValue={response} />
      ))}
    </FormContent>
  );
}
