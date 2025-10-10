'use client';

import type { JsonObject } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import {
  FormContent,
  FormHeader,
  FormInstructions,
} from '@/features/questionnaires/components/form';
import type { FormValues } from '@/features/questionnaires/mogs/item';
import { Item } from '@/features/questionnaires/mogs/item';
import { QUESTIONS } from '@/features/questionnaires/mogs/questions';
import { useTRPC } from '@/trpc/react';
import type { TView } from '@/types/view-types';

export default function IusRPage() {
  const { view } = useParams<{ view: TView }>();
  const [_, idTest] = view;

  const api = useTRPC();

  const {
    data: administration,
    isLoading,
    isFetching,
  } = useQuery(
    api.administrations.findUnique.queryOptions(
      { id: idTest },
      {
        enabled: !!idTest,
      },
    ),
  );

  const response = (administration?.records as JsonObject).response as Record<
    string,
    string
  >;

  const form = useForm<FormValues>();

  if (!response || isLoading || isFetching) return null;

  return (
    <FormContent<FormValues>
      form={form}
      title="Moral Orientation Guilt Scale (MOGS)"
      viewOnly
    >
      <FormHeader>
        <FormInstructions>
          <p>
            Di seguito troverà una serie di affermazioni. La preghiamo di
            leggere attentamente ciascuna affermazione e di indicare quella che
            meglio la descrive.
          </p>
        </FormInstructions>
        <ul className="text-primary flex items-end justify-end gap-2 pr-4">
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Per nulla
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Poco
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Abbastanza
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Molto
          </li>
          <li className="flex w-10 rotate-180 items-center text-sm [writing-mode:vertical-rl]">
            Moltissimo
          </li>
        </ul>
      </FormHeader>
      {QUESTIONS.map((question, index) => (
        <Item key={index} question={question} defaultValue={response} />
      ))}
    </FormContent>
  );
}
