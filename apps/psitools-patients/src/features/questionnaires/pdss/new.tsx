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
import type { FormValues } from '@/features/questionnaires/pdss/item';
import { formSchema, Item } from '@/features/questionnaires/pdss/item';
import { QUESTIONS } from '@/features/questionnaires/pdss/questions';

const NewAdministration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const rawScore =
      +Object.entries(data.response).reduce((acc, [_, value]) => [
        acc[0],
        `${parseInt(acc[1]) + parseInt(value)}`,
      ])[1] / 7;

    const score = +(Math.round(+`${rawScore}e2`).toString() + 'e-2');

    return {
      response: data.response,
      score,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'pdss',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Panic Disorder Severity Scale (PDSS)"
    >
      <FormHeader>
        <FormInstructions>
          <p className="font-bold">Istruzioni</p>
          <p>
            Nel questionario che segue si utilizza la definizione di attacco di
            panico come un&apos;improvvisa ondata di paura o disagio
            accompagnata da almeno quattro dei sintomi &ldquo;ondata
            improvvisa&rdquo; è necessario che i sintomi raggiungano il loro
            massimo nei primi dieci minuti. Di seguito si trovano elencati i
            sintomi da prendere in considerazione:
          </p>
          <ul className="ml-4 list-disc">
            <li>
              battito cardiaco accelerato o martellante dolore o fastidio al
              petto
            </li>
            <li>brividi o vampate di calore tremori</li>
            <li>sudore</li>
            <li>nausea</li>
            <li>paura di perdere il controllo o di impazzire</li>
            <li>vertigini o debolezza</li>
            <li>affanno allucinazioni</li>
            <li>senso di soffocamento</li>
            <li>formicolio</li>
          </ul>
        </FormInstructions>
        <p className="text-left text-sm font-bold">
          Per ognuna delle seguenti domande, rispondi indicando una fra le
          alternative che meglio descrive la tua esperienza.
        </p>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} />
      ))}
      <FormFooter type="pdss" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
