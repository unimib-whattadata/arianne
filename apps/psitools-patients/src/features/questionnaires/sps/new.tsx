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
import type { FormValues } from '@/features/questionnaires/sps/item';
import { formSchema, Item } from '@/features/questionnaires/sps/item';
import { QUESTIONS } from '@/features/questionnaires/sps/questions';

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
    type: 'sps',
  });

  return (
    <FormContent<FormValues> form={form} title="Social Phobia Scale (SPS)">
      <FormHeader>
        <FormInstructions>
          <p className="mb-4 rounded-md bg-white-900 p-4">
            Le affermazioni si riferiscono a situazioni ed esperienze che
            possono provocare disagio e ansia. Legga ogni frase e indichi quanto
            bene descrive la sua esperienza, mettendo una crocetta sulla colonna
            adatta.
          </p>
        </FormInstructions>
        <ul className="flex items-end justify-end gap-2 pr-4 text-primary">
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Per nulla
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Un poco
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
        <Item key={index} question={question} index={index + 1} />
      ))}
      <FormFooter type="sps" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
