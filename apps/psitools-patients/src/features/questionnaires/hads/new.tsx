import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormFooter,
  FormSubmit,
} from '@/features/questionnaires/components/form';
import type { FormValues } from '@/features/questionnaires/hads/item';
import { formSchema, Item } from '@/features/questionnaires/hads/item';
import { QUESTIONS } from '@/features/questionnaires/hads/questions';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';

const NewAdministration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const anxietyIds = [1, 3, 5, 7, 9, 11, 13];
    const depressionIds = [2, 4, 6, 8, 10, 12, 14];

    const calculateScore = (questions: number[]) =>
      +Object.values(data.response).reduce((acc, curr, index) => {
        if (questions.includes(index + 1)) {
          return `${parseInt(acc) + parseInt(curr)}`;
        }
        return acc;
      }, '0');

    return {
      score: {
        anxiety: calculateScore(anxietyIds),
        depression: calculateScore(depressionIds),
      },
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'hads',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Hospital anxiety and depression scale (HADS)"
    >
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} />
      ))}
      <FormFooter type="hads" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
