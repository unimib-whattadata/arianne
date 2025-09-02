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
} from '@/features/questionnaires/haq/item';
import {
  INSTRUCTIONS,
  QUESTIONS,
} from '@/features/questionnaires/haq/questions';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';

const formSchema = extendWithTherapistData(formSchemaItem);
type FormValues = z.infer<typeof formSchema>;

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
    type: 'haq',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Health Anxiety Questionnaire (HAQ)"
    >
      <FormHeader>
        <FormInstructions>
          <p>
            {/* Le seguenti domande si riferiscono alle preoccupazioni per la
            salute. Legga attentamente ogni domanda e indichi con che frequenza
            è stato disturbato durante <strong> l’ultima settimana</strong>,
            mettendo una crocetta nelle colonne accanto a ciascuna domanda. */}
            {INSTRUCTIONS}
          </p>
        </FormInstructions>
        <ul className="flex items-end justify-end gap-2 pr-4 text-primary">
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Mai o Raramente
          </li>
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Qualche volta
          </li>
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Spesso
          </li>
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Per la maggior parte del tempo
          </li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} />
      ))}
      <FormFooter type="haq" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;

{
  /* <ul className="flex justify-end gap-2 pr-4 text-primary">
<li className="w-20 text-center text-sm">Mai o Raramente</li>
<li className="w-20 text-center text-sm">Qualche volta</li>
<li className="w-20 text-center text-sm">Spesso</li>
<li className="w-20 text-center text-sm ">
  Per la maggior parte del tempo
</li>
</ul> */
}
