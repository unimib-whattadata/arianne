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
import type { FormValues } from '@/features/questionnaires/pid-5-sf/item';
import { formSchema, Item } from '@/features/questionnaires/pid-5-sf/item';
import { QUESTIONS } from '@/features/questionnaires/pid-5-sf/questions';

const NewAdministration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const affettivitaIds = [28, 30, 73, 83];
    const anedoniaIds = [9, 11, 43, 65];
    const angosciaIds = [17, 45, 58, 79];
    const ansiaIds = [24, 36, 48, 78];
    const convinzioniIds = [34, 54, 59, 96];
    const depressivitaIds = [26, 60, 70, 74];
    const disregolazioneIds = [15, 63, 88, 98];
    const distraibilitaIds = [39, 49, 55, 91];
    const eccentricitaIds = [10, 22, 61, 94];
    const evitamentoIds = [29, 40, 56, 93];
    const grandiositaIds = [14, 37, 85, 90];
    const impulsivitaIds = [2, 5, 6, 8];
    const ingannoIds = [18, 51, 95, 99];
    const insensibilitaIds = [7, 62, 72, 82];
    const irresponsabilitaIds = [47, 64, 68, 76];
    const labilitaIds = [41, 53, 71, 81];
    const manipolatorietaIds = [35, 44, 69, 100];
    const ostilitaIds = [12, 31, 66, 75];
    const perfezionismoIds = [33, 42, 80, 89];
    const preservazioneIds = [19, 25, 32, 46];
    const ricercaIds = [23, 77, 87, 97];
    const ritiroIds = [27, 52, 57, 84];
    const sospettositaIds = [1, 38, 50, 86];
    const sottomissioneIds = [3, 4, 20, 92];
    const tendenzaIds = [13, 16, 21, 67];

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
        anedonia: calculateScore(anedoniaIds),
        angoscia: calculateScore(angosciaIds),
        ansia: calculateScore(ansiaIds),
        convinzioni: calculateScore(convinzioniIds),
        depressivita: calculateScore(depressivitaIds),
        disregolazione: calculateScore(disregolazioneIds),
        distraibilita: calculateScore(distraibilitaIds),
        eccentricita: calculateScore(eccentricitaIds),
        evitamento: calculateScore(evitamentoIds),
        grandiosita: calculateScore(grandiositaIds),
        impulsivita: calculateScore(impulsivitaIds),
        inganno: calculateScore(ingannoIds),
        insensibilita: calculateScore(insensibilitaIds),
        irresponsabilita: calculateScore(irresponsabilitaIds),
        labilita: calculateScore(labilitaIds),
        manipolatorieta: calculateScore(manipolatorietaIds),
        ostilita: calculateScore(ostilitaIds),
        perfezionismo: calculateScore(perfezionismoIds),
        preservazione: calculateScore(preservazioneIds),
        ricerca: calculateScore(ricercaIds),
        ritiro: calculateScore(ritiroIds),
        sospettosita: calculateScore(sospettositaIds),
        sottomissione: calculateScore(sottomissioneIds),
        tendenza: calculateScore(tendenzaIds),
      },
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'pid-5-sf',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Inventario di personalità per il DSM-5 Short Form (PID-5-SF) – Adulto"
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

      <FormFooter type="pid-5-sf" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
