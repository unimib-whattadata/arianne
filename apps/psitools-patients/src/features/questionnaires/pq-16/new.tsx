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
import type { FormValues } from '@/features/questionnaires/pq-16/item';
import { formSchema, PQ16Item } from '@/features/questionnaires/pq-16/item';
import { QUESTIONS } from '@/features/questionnaires/pq-16/questions';

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
    type: 'pq-16',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Questionario dei sintomi prodromici (PQ-16)"
    >
      <FormHeader>
        <FormInstructions>
          <p>
            Il questionario esplora aspetti di pensieri, sentimenti ed
            esperienze. Per ogni affermazione indica se sei d&apos;accordo o in
            disaccordo, selezionando VERO o FALSO sulla destra. Nel caso tu
            risponda &quot;vero&quot;, indica nell&apos;ultima colonna il
            livello di disagio associato (nessuno=0; lieve=1; moderato=2;
            grave=3).
          </p>
        </FormInstructions>
        <div className="flex justify-end">
          <ul className="mr-12 flex gap-2 text-primary">
            <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
              Vero
            </li>
            <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
              Falso
            </li>
          </ul>
          <ul className="flex gap-2 pr-4 text-primary">
            <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
              Nessuno
            </li>
            <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
              Lieve
            </li>
            <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
              Moderato
            </li>
            <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
              Grave
            </li>
          </ul>
        </div>
      </FormHeader>
      {QUESTIONS.map((question) => {
        return (
          <PQ16Item
            key={question.index}
            question={question.text}
            index={question.index}
          />
        );
      })}
      <FormFooter type="pq-16" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
