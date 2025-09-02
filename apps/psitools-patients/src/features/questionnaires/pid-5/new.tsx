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
import type { FormValues } from '@/features/questionnaires/pid-5/item';
import { formSchema, Item } from '@/features/questionnaires/pid-5/item';
import { QUESTIONS } from '@/features/questionnaires/pid-5/questions';

const NewAdministration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const affettivitaIds = [8, 45, 48, 91, 101, 167, 184];
    const anedoniaIds = [1, 23, 26, 30, 125, 155, 157, 189];
    const angosciaIds = [12, 50, 57, 64, 127, 149, 175];
    const ansiaIds = [79, 93, 95, 96, 109, 110, 130, 141, 174];
    const convinzioniIds = [94, 99, 106, 139, 143, 150, 150, 194, 209];
    const depressivitaIds = [
      27, 61, 66, 81, 86, 104, 119, 148, 151, 163, 168, 169, 178, 212,
    ];
    const disregolazioneIds = [
      36, 37, 42, 44, 59, 77, 83, 154, 192, 193, 213, 217,
    ];
    const distraibilitaIds = [6, 29, 47, 68, 88, 118, 132, 144, 199];
    const eccentricitaIds = [
      5, 21, 24, 25, 33, 52, 55, 70, 71, 152, 172, 185, 205,
    ];
    const evitamentoIds = [89, 97, 108, 120, 145, 203];
    const grandiositaIds = [40, 65, 114, 179, 187, 197];
    const impulsivitaIds = [4, 16, 17, 22, 58, 204];
    const ingannoIds = [41, 53, 56, 76, 126, 134, 142, 206, 214, 218];
    const insensibilitaIds = [
      11, 13, 19, 54, 72, 73, 90, 153, 166, 183, 198, 200, 207, 208,
    ];
    const irresponsabilitaIds = [31, 129, 156, 160, 171, 201, 210];
    const labilitaIds = [18, 62, 102, 122, 138, 165, 181];
    const manipolatorietaIds = [107, 125, 162, 180, 219];
    const ostilitaIds = [28, 32, 38, 85, 92, 116, 158, 170, 188, 216];
    const perfezionismoIds = [34, 49, 105, 115, 123, 135, 140, 176, 196, 220];
    const preservazioneIds = [46, 51, 60, 78, 80, 100, 121, 128, 137];
    const ricercaIds = [14, 43, 74, 111, 113, 173, 191, 211];
    const ritiroIds = [10, 20, 75, 82, 136, 146, 147, 161, 182, 186];
    const sospettositaIds = [2, 103, 117, 131, 133, 177, 190];
    const sottomissioneIds = [9, 15, 63, 202];
    const tendenzaIds = [
      3, 7, 35, 39, 48, 67, 69, 87, 98, 112, 159, 164, 195, 215,
    ];

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
    type: 'pid-5',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Inventario di personalità per il DSM-5 (PID-5) – Adulto"
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

      <FormFooter type="pid-5" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
