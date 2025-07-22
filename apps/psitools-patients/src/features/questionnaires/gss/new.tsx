import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormFooter,
  FormHeader,
  FormInstructions,
  FormSubmit,
} from '@/features/questionnaires/components/form';
import type { FormValues } from '@/features/questionnaires/gss/item';
import { formSchema, Item } from '@/features/questionnaires/gss/item';
import { QUESTIONS } from '@/features/questionnaires/gss/questions';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';

const NewAdministration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const REVERSE_QUESTIONS = [0, 4, 7];
    const updatedResponse = Object.entries(data.response).map(
      ([key, value], index) => {
        let updatedValue = parseInt(value) + 1;

        if (REVERSE_QUESTIONS.includes(index)) {
          updatedValue = Math.abs(updatedValue - 8);
        }

        return [key, updatedValue.toString()];
      },
    );
    const updatedResponseObject = Object.fromEntries(updatedResponse) as Record<
      string,
      string
    >;

    const score = Object.values(updatedResponseObject).reduce(
      (acc, value) => acc + parseInt(value),
      0,
    );

    return {
      response: updatedResponseObject,
      score,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'gss',
  });

  return (
    <FormContent<FormValues> form={form} title="Guilt Sensitivity Scale (GSS)">
      <FormHeader>
        <FormInstructions>
          <p>
            Qui sotto troverà una lista di affermazioni. Valuti quanto ciascuna
            di esse è vera per lei. Utilizzi i criteri della scala sotto
            riportata per esprimere quanto, "mai" a "sempre", ogni affermazione
            sia vera per lei.
          </p>
        </FormInstructions>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} />
      ))}
      <FormFooter type="gss" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
