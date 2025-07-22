'use client';

import type { JsonObject } from '@prisma/client/runtime/library';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import type { FormValues } from '@/features/questionnaires/cba-ve/cba-ve-item';
import { CbaVeItem } from '@/features/questionnaires/cba-ve/cba-ve-item';
import { QUESTIONS } from '@/features/questionnaires/cba-ve/cbave-questions';
import {
  FormContent,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import { useTRPC } from '@/trpc/react';
import type { TView } from '@/types/view-types';

export default function ShowSingleAdministrationPage() {
  const { view } = useParams<{ view: TView }>();
  const [_, idTest] = view;

  const api = useTRPC();

  const {
    data: administration,
    isLoading,
    isFetching,
  } = useQuery(
    api.administration.findUnique.queryOptions(
      {
        where: { id: idTest },
      },
      {
        select: (data) => data.administration,
      },
    ),
  );

  const response = (administration?.records as JsonObject)
    .response as JsonObject;

  const form = useForm<FormValues>();

  if (!response || isLoading || isFetching) return null;

  return (
    <FormContent
      form={form}
      title="Cognitive Behavioural Assessment - Valutazione dell'esito (CBA-VE)"
      viewOnly
    >
      {QUESTIONS.map((section, index) => (
        <section key={index.toString()} className="bg-gray-10 pb-4">
          <FormHeader>
            <FormInstructions>{section.instruction}</FormInstructions>
            <ul className="flex justify-end gap-2 pr-4 text-primary">
              <li className="w-20 text-center text-sm">Per nulla</li>
              <li className="w-20 text-center text-sm">Poco</li>
              <li className="w-20 text-center text-sm">Abbastanza</li>
              <li className="w-20 text-center text-sm">Molto</li>
              <li className="w-20 text-center text-sm">Moltissimo</li>
            </ul>
          </FormHeader>

          {section.questions.map((question) => {
            return (
              <CbaVeItem
                key={question.index}
                question={question.text}
                index={question.index}
                defaultValue={response?.[`item-${question.index}`] as string}
              />
            );
          })}
        </section>
      ))}
    </FormContent>
  );
}
