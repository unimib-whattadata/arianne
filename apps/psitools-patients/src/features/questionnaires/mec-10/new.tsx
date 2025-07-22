import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormFooter,
  FormHeader,
  FormInstructions,
  FormSubmit,
} from '@/features/questionnaires/components/form';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';
import type { FormValues } from '@/features/questionnaires/mec-10/item';
import { formSchema, Item } from '@/features/questionnaires/mec-10/item';
import { QUESTIONS } from '@/features/questionnaires/mec-10/questions';

const NewAdministration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    return {
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'mec-10',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Italian Measure of Eating Compulsivity (MEC10-IT)"
    >
      <FormHeader>
        <FormInstructions>
          <p className="mb-4 rounded-md bg-white-900 p-4">
            La preghiamo di rispondere a tutte le domande ponendo un segno in
            corrispondenza del valore numerico – compreso tra 0 (COMPLETAMENTE
            FALSO) e 4 (COMPLETAMENTE VERO) – che meglio La rappresenta.
          </p>
          <p className="font-bold">Non esistono risposte giuste o sbagliate</p>
        </FormInstructions>
        <ul className="flex items-end justify-end gap-2 pr-4 text-primary">
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
        <Item key={index} question={question} index={index + 1} />
      ))}
      <FormFooter type="mec-10" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
