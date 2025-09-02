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
import type { FormValues } from '@/features/questionnaires/pid-5-bf/item';
import { formSchema, Item } from '@/features/questionnaires/pid-5-bf/item';
import { QUESTIONS } from '@/features/questionnaires/pid-5-bf/questions';

const NewAdministration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const affettivitaIds = [8, 9, 10, 11, 15];
    const distaccoIds = [4, 13, 14, 16, 18];
    const antagonismoIds = [17, 19, 20, 22, 25];
    const disinibizioneIds = [21, 2, 3, 5, 6];
    const psicoticismoIds = [7, 12, 21, 23, 24];

    const calculateScore = (questions: number[]) =>
      +Object.values(data.response).reduce((acc, curr, index) => {
        if (questions.includes(index + 1)) {
          return `${parseInt(acc) + parseInt(curr)}`;
        }
        return acc;
      }, '0');

    return {
      score: {
        affettivita: calculateScore(affettivitaIds),
        distacco: calculateScore(distaccoIds),
        antagonismo: calculateScore(antagonismoIds),
        disinibizione: calculateScore(disinibizioneIds),
        psicoticismo: calculateScore(psicoticismoIds),
      },
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'pid-5-bf',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Inventario di personalità per il DSM-5 – Versione breve (PID-5-BF) "
    >
      <FormHeader>
        <FormInstructions>
          <p className="rounded-md bg-white-900 p-4">
            Questo è un elenco di affermazioni che persone differenti potrebbero
            fare a proposito di loro stesse. Siamo interessati a sapere in quale
            modo lei si descriverebbe. Non ci sono risposte “giuste” o
            “sbagliate”. Quindi, cerchi di descriversi nel modo più sincero
            possibile; considereremo le sue risposte confidenziali.
          </p>
          <p className="p-4 font-bold">
            La invitiamo a usare tutto il tempo che le è necessario e a leggere
            attentamente ciascuna affermazione, scegliendo la risposta che la
            descrive nel modo migliore.
          </p>
        </FormInstructions>
        <ul className="flex items-end justify-end gap-2 pr-4 text-primary">
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Sempre o spesso falso
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Talvolta o abbastanza falso
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Talvolta o abbastanza vero
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Sempre o spesso vero
          </li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} />
      ))}

      <FormFooter type="pid-5-bf" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
