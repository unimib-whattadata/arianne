'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import {
  CbaVeItem,
  formSchema as formSchemaItem,
} from '@/features/questionnaires/cba-ve/cba-ve-item';
import { QUESTIONS } from '@/features/questionnaires/cba-ve/cbave-questions';
import {
  FormContent,
  FormFooter,
  FormSubmit,
} from '@/features/questionnaires/components/form';
import { extendWithTherapistData } from '@/features/questionnaires/components/therapist-schema';
import { useAdministrationSubmit } from '@/features/questionnaires/hooks/use-administration-submit';
import { getScores } from '@/utils/administrationScores';

const formSchema = extendWithTherapistData(formSchemaItem);
type FormValues = z.infer<typeof formSchema>;

const NewAdministration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formatRecords = (data: FormValues) => {
    return {
      scores: getScores(data.response),
      response: data.response,
    };
  };

  const { onSubmit } = useAdministrationSubmit<FormValues>({
    formatRecords,
    type: 'cba-ve',
  });

  return (
    <FormContent<FormValues>
      form={form}
      title="Cognitive Behavioural Assessment - Valutazione dell'esito (CBA-VE)"
    >
      <div className="space-y-4 bg-gray-10">
        {QUESTIONS.map((section, index) => (
          <section
            key={index.toString()}
            className="relative z-10 bg-gray-10 pb-4"
          >
            <header className="sticky top-0 bg-gray-10 pb-3">
              <p className="mb-4 rounded-md bg-white p-4">
                {section.instruction}
              </p>
              <ul className="flex justify-end gap-2 pr-4 text-primary">
                <li className="w-20 text-center text-sm">Per nulla</li>
                <li className="w-20 text-center text-sm">Poco</li>
                <li className="w-20 text-center text-sm">Abbastanza</li>
                <li className="w-20 text-center text-sm">Molto</li>
                <li className="w-20 text-center text-sm">Moltissimo</li>
              </ul>
            </header>
            {section.questions.map((question) => (
              <CbaVeItem
                key={question.index}
                question={question.text}
                index={question.index}
              />
            ))}
          </section>
        ))}
      </div>
      <FormFooter type="cba-ve" className="justify-end">
        <FormSubmit form={form} onSubmit={onSubmit} />
      </FormFooter>
    </FormContent>
  );
};

export default NewAdministration;
