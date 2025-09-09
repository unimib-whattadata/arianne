import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormFooter,
  FormHeader,
  FormInstructions,
  FormSubmit,
} from '@/features/questionnaires/components/form';
import type { FormValues } from '@/features/questionnaires/core-om/item';
import { formSchema, Item } from '@/features/questionnaires/core-om/item';
import { QUESTIONS } from '@/features/questionnaires/core-om/questions';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';

const NewAdministration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    const subjectiveScore = [4, 14, 17, 31];
    const symptomsScore = [2, 5, 8, 11, 13, 15, 18, 20, 23, 27, 28, 30];
    const operationScore = [1, 3, 7, 10, 12, 19, 21, 25, 26, 29, 32, 33];
    const riskScore = [6, 9, 16, 22, 24, 34];

    return {
      score: {
        subjectiveScore:
          +Object.values(data.response).reduce((acc, value, index) => {
            const id = index + 1;
            if (subjectiveScore.includes(id)) {
              return (+acc + +value).toString();
            }
            return acc;
          }, '0') / subjectiveScore.length,

        symptomsScore:
          +Object.values(data.response).reduce((acc, value, index) => {
            const id = index + 1;
            if (symptomsScore.includes(id)) {
              return (+acc + +value).toString();
            }
            return acc;
          }, '0') / symptomsScore.length,

        operationScore:
          +Object.values(data.response).reduce((acc, value, index) => {
            const id = index + 1;
            if (operationScore.includes(id)) {
              return (+acc + +value).toString();
            }
            return acc;
          }, '0') / operationScore.length,

        riskScore:
          +Object.values(data.response).reduce((acc, value, index) => {
            const id = index + 1;
            if (riskScore.includes(id)) {
              return (+acc + +value).toString();
            }
            return acc;
          }, '0') / riskScore.length,
      },
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'core-om',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Clinical Outcomes in Routine Evaluation - Outcome Measure (CORE - OM)"
    >
      <FormHeader>
        <FormInstructions>
          <p>
            Di seguito troverà una serie di affermazioni. La preghiamo di
            leggere attentamente ciascuna affermazione e di indicare quella che
            meglio la descrive.
          </p>
        </FormInstructions>

        <ul className="flex justify-end gap-2 pr-4 text-primary">
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Per nulla
          </li>
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Solo Occasionalmente
          </li>
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Ogni tanto
          </li>
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Spesso
          </li>
          <li className="flex h-32 w-10 rotate-180 items-center text-sm leading-3 [writing-mode:vertical-rl]">
            Molto Spesso o sempre
          </li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} />
      ))}
      <FormFooter type="core-om" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
