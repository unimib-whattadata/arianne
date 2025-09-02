import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { FormValues } from '@/features/questionnaires/asi-3/item';
import { formSchema, Item } from '@/features/questionnaires/asi-3/item';
import { QUESTIONS } from '@/features/questionnaires/asi-3/questions';
import {
  FormContent,
  FormFooter,
  FormHeader,
  FormInstructions,
  FormSubmit,
} from '@/features/questionnaires/components/form';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';

const NewAdministration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const physicalFearScore = [3, 4, 6, 8, 9, 10, 11, 14];
    const lossOfControlFearScore = [2, 12, 15, 16];
    const socialFearScore = [1, 5, 7, 13];

    const calculateScore = (scoreIds: number[]) => {
      return Object.values(data.response).reduce((acc, value, index) => {
        const id = index + 1;
        if (scoreIds.includes(id) && !isNaN(Number(value))) {
          return acc + Number(value);
        }
        return acc;
      }, 0);
    };

    return {
      score: {
        physicalFearScore: calculateScore(physicalFearScore),
        lossOfControlFearScore: calculateScore(lossOfControlFearScore),
        socialFearScore: calculateScore(socialFearScore),
      },
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'asi-3',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Anxiety Sensitivity Index-3 (ASI-3)"
    >
      <FormHeader>
        <FormInstructions>
          <p>
            Di seguito troverà una serie di affermazioni. La preghiamo di
            leggere attentamente ciascuna affermazione e di indicare quella che
            meglio la descrive.
          </p>
        </FormInstructions>

        <ul className="flex justify-end gap-2 pr-4 text-primary">
          <li className="w-20 text-center text-sm">Per nulla</li>
          <li className="w-20 text-center text-sm">Poco</li>
          <li className="w-20 text-center text-sm">Abbastanza</li>
          <li className="w-20 text-center text-sm">Molto</li>
          <li className="w-20 text-center text-sm">Moltissimo</li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} />
      ))}
      <FormFooter type="asi-3" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
