import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { FormValues } from '@/features/questionnaires/asrm/item';
import { formSchema, Item } from '@/features/questionnaires/asrm/item';
import { QUESTIONS } from '@/features/questionnaires/asrm/questions';
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
    const rawScore =
      +Object.entries(data.response).reduce((acc, [_, value]) => [
        acc[0],
        `${parseInt(acc[1]) + parseInt(value)}`,
      ])[1] / 5;

    const score = +(Math.round(+`${rawScore}e2`).toString() + 'e-2');

    return {
      response: data.response,
      score,
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
          <p>
            Nella Scala di valutazione dei sintomi trasversali di livello 1 che
            ha appena compilato, ha indicato che nelle ultime due settimane “ha
            dormito meno rispetto al solito ma ha avuto comunque molta energia”
            e/o “ha cominciato molti più progetti rispetto al solito o ha fatto
            cose più rischiose rispetto al solito” a un livello di gravità lieve
            o maggiore. I seguenti cinque gruppi di affermazioni indagano queste
            sensazioni nel dettaglio.
          </p>
          <ul className="mb-4 ml-4 mt-4 list-disc">
            <li>
              Per favore, legga ciascun gruppo di affermazioni attentamente.
            </li>
            <li>
              Scelga per ogni gruppo l’affermazione che meglio descrive il modo
              in cui si è sentito nell’ultima settimana.
            </li>
          </ul>

          <p>
            Nota: occasionalmente significa “una o due volte”; spesso significa
            “diverse volte o più”; frequentemente significa “la maggior parte
            del tempo”.
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
