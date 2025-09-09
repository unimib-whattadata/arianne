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
import type { FormValues } from '@/features/questionnaires/pswq-16/item';
import { formSchema, Item } from '@/features/questionnaires/pswq-16/item';
import { QUESTIONS } from '@/features/questionnaires/pswq-16/questions';

const NewAdministration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    return {
      score: parseInt(
        Object.entries(data.response).reduce((acc, [_, value]) => {
          return [acc[0], `${parseInt(acc[1]) + parseInt(value)}`];
        })[1],
      ),
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'pswq-16',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Penn State Worry Questionnaire (PSWQ-16)"
    >
      <FormHeader>
        <FormInstructions>
          <p>
            Per favore leggi attentamente ogni affermazione e valuta quanto ti
            trovi in accordo con essa, selezionando la casella appropriata nello
            spazio apposito accanto a ciascuna affermazione. È importante
            ricordare che non ci sono risposte giuste o sbagliate. Non
            soffermarti troppo su ogni affermazione: la prima risposta è spesso
            la più accurata.
          </p>
        </FormInstructions>
        <ul className="flex items-end justify-end gap-2 pr-4 text-primary">
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Per nulla d'accordo
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Un poco d'accordo
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Abbastanza d'accordo
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Molto d'accordo
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Completamente d'accordo
          </li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} />
      ))}
      <FormFooter type="pswq-16" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
