'use client';
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';

import type { FormData } from '@/features/diaries/cognitive-behavioral/schema';
import { FormSchema } from '@/features/diaries/cognitive-behavioral/schema';

import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
  Step8,
  Step9,
  Step10,
  Step11,
  Step12,
} from '@/features/diaries/cognitive-behavioral/steps';
import { FormLayout } from '@/features/diaries/components/form-layout';
import { useSteps } from '@/features/diaries/context/step-context';
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
        type: 'cognitive_behavioral',
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
        <FormLayout<FormData> type="cognitive_behavioral" diaryId={diaryId}>
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Step4 />}
          {currentStep === 5 && <Step5 />}
          {currentStep === 6 && <Step6 />}
          {currentStep === 7 && <Step7 />}
          {currentStep === 8 && <Step8 />}
          {currentStep === 9 && <Step9 />}
          {currentStep === 10 && <Step10 />}
          {currentStep === 11 && <Step11 />}
          {currentStep === 12 && <Step12 />}
        </FormLayout>
      </form>
    </Form>
  );
}
