'use client';

import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/ptsq/item';
import { Item } from '@/features/questionnaires/ptsq/item';
import { QUESTIONS } from '@/features/questionnaires/ptsq/questions';

export default function IusRPage() {
  const { administration, isLoading } = useAdministration<FormValues>();

  const form = useForm<FormValues>();

  if (!administration || isLoading) return null;

  const { response } = administration.records;

  return (
    <FormContent<FormValues>
      form={form}
      title="Post-Traumatic Symptom Questionnaire (PTSQ)"
      viewOnly
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

        <ul className="text-primary flex justify-end gap-2 pr-4">
          <li className="w-20 text-center text-sm">Per nulla</li>
          <li className="w-20 text-center text-sm">Poco</li>
          <li className="w-20 text-center text-sm">Abbastanza</li>
          <li className="w-20 text-center text-sm">Molto</li>
          <li className="w-20 text-center text-sm">Moltissimo</li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} defaultValue={response} />
      ))}
    </FormContent>
  );
}
