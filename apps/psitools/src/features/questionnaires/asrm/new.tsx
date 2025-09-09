'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import {
  formSchema as formSchemaItem,
  Item,
} from '@/features/questionnaires/asrm/item';
import {
  INSTRUCTIONS_1,
  QUESTIONS,
} from '@/features/questionnaires/asrm/questions';
import {
  FormContent,
  FormFooter,
  FormHeader,
  FormInstructions,
  FormSubmit,
} from '@/features/questionnaires/components/form';
import { extendWithTherapistData } from '@/features/questionnaires/components/therapist-schema';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';

const formSchema = extendWithTherapistData(formSchemaItem);

type FormValues = z.infer<typeof formSchema>;

const NewAdministration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const rawScore =
      +Object.entries(data.response).reduce((acc, [_, value]) => [
        acc[0],
        `${Number.parseInt(acc[1]) + Number.parseInt(value)}`,
      ])[1] / 5;

    const score = +(Math.round(+`${rawScore}e2`).toString() + 'e-2');

    return {
      response: data.response,
      score,
      therapistName: data.therapistName,
      therapistLastname: data.therapistLastname,
      modality: data.modality,
      createdAt: data.createdAt,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'asrm',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Altman Self-Rating Mania Scale (ASRM)"
    >
      <FormHeader>
        <FormInstructions>
          <p className="font-bold">Istruzioni</p>
          <p>{INSTRUCTIONS_1}</p>
          <ul className="mt-4 mb-4 ml-4 list-disc">
            <li>
              Per favore, legga ciascun gruppo di affermazioni attentamente.
            </li>
            <li>
              Scelga per ogni gruppo l'affermazione che meglio descrive il modo
              in cui si è sentito nell'ultima settimana.
            </li>
          </ul>

          <p>
            Nota: occasionalmente significa "una o due volte"; spesso significa
            "diverse volte o più"; frequentemente significa "la maggior parte
            del tempo".
          </p>
        </FormInstructions>
        <p className="text-left text-sm font-bold">
          Per ognuna delle seguenti domande, rispondi indicando una fra le
          alternative che meglio descrive la tua esperienza.
        </p>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} />
      ))}
      <FormFooter type="asrm" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
