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
import {
  formSchema as formSchemaItem,
  Item,
} from '@/features/questionnaires/gad-7/item';
import {
  INSTRUCTIONS,
  QUESTIONS,
} from '@/features/questionnaires/gad-7/questions';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';

const formSchema = extendWithTherapistData(formSchemaItem);
type FormValues = z.infer<typeof formSchema>;

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
    type: 'gad-7',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="General Anxiety Disorder-7 (GAD-7)"
    >
      <FormHeader>
        <FormInstructions>
          <p className="mb-4 rounded-md bg-white p-4">
            {/* Nelle <span className="font-bold">ultime 2 settimane</span>, con
            quale frequenza ti hanno dato fastidio ciascuno dei seguenti
            problemi? */}
            {INSTRUCTIONS}
          </p>
        </FormInstructions>
        <ul className="flex items-center justify-end gap-2 pr-4 text-primary">
          <li className="w-24 text-center text-sm">Mai</li>
          <li className="w-24 text-center text-sm">Alcuni giorni</li>
          <li className="w-24 text-center text-sm">
            Per oltre la metà dei giorni
          </li>
          <li className="w-24 text-center text-sm">Quasi ogni giorno</li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} index={index + 1} />
      ))}
      <FormFooter type="gad-7" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
