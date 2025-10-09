'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import { FormLayout } from '@/features/diaries/components/form-layout';
import { useSteps } from '@/features/diaries/context/step-context';
import type { FormData } from '@/features/diaries/sleep-evening/schema';
import { FormSchema } from '@/features/diaries/sleep-evening/schema';
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
} from '@/features/diaries/sleep-evening/steps';
import { useTRPC } from '@/trpc/react';

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id: diaryId } = use(searchParams);
  const { currentStep } = useSteps();

  const api = useTRPC();
  const { data } = useQuery(
    api.diaries.find.queryOptions(
      {
        type: 'sleep_evening',
        id: diaryId,
      },
      {
        enabled: !!diaryId,
        select: (diary) => diary?.content as FormData,
      },
    ),
  );

  const methods = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    values: data,
  });

  return (
    <Form {...methods}>
      <form>
        <FormLayout<FormData> type="sleep_evening" diaryId={diaryId}>
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Step4 />}
          {currentStep === 5 && <Step5 />}
        </FormLayout>
      </form>
    </Form>
  );
}
