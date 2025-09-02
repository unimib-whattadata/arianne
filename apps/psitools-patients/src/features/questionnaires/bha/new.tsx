import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { FormValues } from '@/features/questionnaires/bha/item';
import { formSchema, Item } from '@/features/questionnaires/bha/item';
import { QUESTIONS } from '@/features/questionnaires/bha/questions';
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
    return {
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'bha',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Brief Assessment of Hopelessness (BAH)"
    >
      <FormHeader>
        <FormInstructions>
          <p className="pb-4">
            Per favore legga attentamente una alla volta le 7 affermazioni del
            presente questionario. Se l'affermazione descrive i Suoi
            atteggiamenti nell'ambito degli ultimi 7 giorni, indichi la casella
            nella colonna "VERO" accanto all'affermazione. Se invece
            l'affermazione NON descrive i Suoi atteggiamenti, indichi la casella
            nella colonna "FALSO".
          </p>
          <p> Si accerti di leggere ogni affermazione attentamente.</p>
        </FormInstructions>
        <div className="flex justify-end">
          <ul className="mr-4 flex gap-2 text-primary">
            <li className="flex w-10 items-center text-sm">Vero</li>
            <li className="flex w-10 items-center text-sm">Falso</li>
          </ul>
        </div>
      </FormHeader>
      {QUESTIONS.map((question) => {
        return (
          <Item
            key={question.index}
            question={question.text}
            index={question.index}
          />
        );
      })}
      <FormFooter type="bha" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
