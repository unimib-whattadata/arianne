'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import {
  FormContent,
  FormFooter,
  FormHeader,
  FormInstructions,
  FormSubmit,
} from '@/features/questionnaires/components/form';
import { extendWithTherapistData } from '@/features/questionnaires/components/therapist-schema';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';
import {
  formSchema as formSchemaItem,
  Item,
} from '@/features/questionnaires/mogs/item';
import {
  INSTRUCTIONS,
  QUESTIONS,
} from '@/features/questionnaires/mogs/questions';

const formSchema = extendWithTherapistData(formSchemaItem);
type FormValues = z.infer<typeof formSchema>;

const NewAdministration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const MNV_QUESTIONS = [5, 6, 7, 9, 14, 15];
    const EMP_QUESTIONS = [2, 10, 13, 16, 17];
    const MODI_QUESTIONS = [1, 8, 12];
    const HARM_QUESTIONS = [3, 4, 11];
    const calculateScore = (questions: number[]) => {
      return questions.reduce((acc, questionId) => {
        const responseKey = `item-${questionId}`;
        const responseValue = data.response[responseKey];

        const parsedValue = responseValue ? parseInt(responseValue, 10) : 0;
        return acc + (isNaN(parsedValue) ? 0 : parsedValue);
      }, 0);
    };

    return {
      score: {
        MNV: calculateScore(MNV_QUESTIONS),
        EMP: calculateScore(EMP_QUESTIONS),
        MODI: calculateScore(MODI_QUESTIONS),
        HARM: calculateScore(HARM_QUESTIONS),
      },
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'mogs',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Moral Orientation Guilt Scale (MOGS)"
    >
      <FormHeader>
        {' '}
        x
        <FormInstructions>
          <p>{INSTRUCTIONS}</p>
        </FormInstructions>
        <ul className="flex items-end justify-end gap-2 pr-4 text-primary">
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Per nulla
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Poco
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
        <Item key={index} question={question} />
      ))}
      <FormFooter type="mogs" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
