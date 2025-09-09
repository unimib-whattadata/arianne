import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormFooter,
  FormHeader,
  FormInstructions,
  FormSubmit,
} from '@/features/questionnaires/components/form';
import type { FormValues } from '@/features/questionnaires/dass-21/item';
import { formSchema, Item } from '@/features/questionnaires/dass-21/item';
import { QUESTIONS } from '@/features/questionnaires/dass-21/questions';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';

const Dass21 = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const anxiety = [2, 4, 7, 9, 15, 19, 20];
    const depression = [3, 5, 10, 13, 16, 17, 21];
    const stress = [1, 6, 8, 11, 12, 14, 18];

    return {
      score: {
        anxiety:
          +Object.entries(data.response).reduce((acc, [index, value]) => {
            if (anxiety.includes(+index.split('-')[1])) {
              return [acc[0], `${parseInt(acc[1]) + parseInt(value)}`];
            }
            return acc;
          })[1] * 2,
        depression:
          +Object.entries(data.response).reduce((acc, [index, value]) => {
            if (depression.includes(+index.split('-')[1])) {
              return [acc[0], `${parseInt(acc[1]) + parseInt(value)}`];
            }
            return acc;
          })[1] * 2,
        stress:
          +Object.entries(data.response).reduce((acc, [index, value]) => {
            if (stress.includes(+index.split('-')[1])) {
              return [acc[0], `${parseInt(acc[1]) + parseInt(value)}`];
            }
            return acc;
          })[1] * 2,
      },
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'dass-21',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Depression Anxiety Stress Scales 21 (DASS-21)"
    >
      <FormHeader>
        <FormInstructions>
          <p>
            Per favore, legga ogni frase e poi indichi con quale frequenza la
            situazione descritta si è verificata negli ultimi sette giorni.
            Esprima la sua valutazione selezionando il valore sulla destra.
            Tenga presente che non esistono risposte giuste o sbagliate. Non
            impieghi troppo tempo per rispondere a ciascuna affermazione, spesso
            la prima risposta è la più accurata. Grazie per la sua preziosa
            disponibilità e collaborazione.
          </p>
        </FormInstructions>

        <ul className="flex items-end justify-end gap-2 pr-4 text-primary">
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Non mi è mai accaduto
          </li>
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Mi è capitato qualche volta
          </li>
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Mi è capitato con una certa frequenza
          </li>
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Mi è capitato spesso
          </li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} />
      ))}
      <FormFooter type="dass-21" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default Dass21;
