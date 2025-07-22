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
import type { FormValues } from '@/features/questionnaires/ptsq/item';
import { formSchema, Item } from '@/features/questionnaires/ptsq/item';
import { QUESTIONS } from '@/features/questionnaires/ptsq/questions';

const NewAdministration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const intrusivenesScore = [1, 2, 3, 4];
    const avoidanceScore = [5, 6, 7, 8];
    const iperarousalScore = [9, 10, 11, 12];

    return {
      score: {
        intrusivenesScore: +Object.values(data.response).reduce(
          (acc, value, index) => {
            const id = index + 1;
            if (intrusivenesScore.includes(id)) {
              return (+acc + +value).toString();
            }
            return acc;
          },
          '0',
        ),

        avoidanceScore: +Object.values(data.response).reduce(
          (acc, value, index) => {
            const id = index + 1;
            if (avoidanceScore.includes(id)) {
              return (+acc + +value).toString();
            }
            return acc;
          },
          '0',
        ),

        iperarousalScore: +Object.values(data.response).reduce(
          (acc, value, index) => {
            const id = index + 1;
            if (iperarousalScore.includes(id)) {
              return (+acc + +value).toString();
            }
            return acc;
          },
          '0',
        ),
      },
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'ptsq',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Post-Traumatic Symptom Questionnaire (PTSQ)"
    >
      <FormHeader>
        <FormInstructions>
          <p>
            Nella lista che segue, sono elencati problemi e disturbi che spesso
            affliggono le persone in seguito ad eventi traumatici e/o stressanti
            della vita. Le chiediamo di leggerla attentamente e di cercare di
            ricordare se ne ha sofferto nella scorsa settimana, oggi compreso, e
            con quale intensità.
            <br />
            <strong>
              ATTENZIONE: la preghiamo di provare a rispondere a tutte le
              domande nel modo più preciso possibile
            </strong>
            <br />
            <br />
            Pensando all'evento traumatico/stressante vissuto...
          </p>
        </FormInstructions>

        <ul className="flex justify-end gap-2 pr-4 text-primary">
          <li className="w-20 text-center text-sm">Per nulla</li>
          <li className="w-20 text-center text-sm">Poco</li>
          <li className="w-20 text-center text-sm">Abbastanza</li>
          <li className="w-20 text-center text-sm">Molto</li>
          <li className="w-20 text-center text-sm">Moltissimo</li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} />
      ))}
      <FormFooter type="ptsq" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
