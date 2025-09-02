'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormLayout } from '@/app/diari/_components/form-layout';
import { useTRPC } from '@/trpc/react';
import { getCookieValue } from '@/utils/get-cookie-value';

const FormSchema = z.object({
  timeConsumation: z.string().optional(),
  typeConsumation: z.string().optional(),
  momentDay: z.string().optional(),
  placeConsumption: z.string().optional(),
  place: z.string().optional(),
  company: z.string().optional(),
  companyPerson: z.string().optional(),
  activitycompany: z.string().optional(),
  whatActivitycompany: z.string().optional(),
  typeofconsumption: z.string().optional(),
  mealConsideration: z.string().optional(),
  excessiveQuantity: z.string().optional(),
  relevanceConsumption: z.string().optional(),
  typeEmotion: z.string().optional(),
  bodilysensation: z.string().optional(),
  influenceConsumption: z.string().optional(),
  reasonInfluence: z.string().optional(),
  PostConsumerBehaviors: z.string().optional(),
  physicalActivity: z.string().optional(),
  PostConsumerEmotions: z.string().optional(),
  WhatPostConsumerEmotion: z.string().optional(),
  durationPhysicalActivity: z.string().optional(),
  typeActivityPhysics: z.string().optional(),
  intenisty: z.number().optional(),
  note: z.string().optional(),
});

const defaultValues = {
  timeConsumation: '',
  typeConsumation: '',
  momentDay: '',
  placeConsumption: '',
  place: '',
  company: '',
  companyPerson: '',
  activitycompany: '',
  whatActivitycompany: '',
  typeofconsumption: '',
  mealConsideration: '',
  excessiveQuantity: '',
  relevanceConsumption: '',
  typeEmotion: '',
  bodilysensation: '',
  influenceConsumption: '',
  reasonInfluence: '',
  PostConsumerBehaviors: '',
  PostConsumerEmotions: '',
  WhatPostConsumerEmotion: '',
  physicalActivity: '',
  durationPhysicalActivity: '',
  typeActivityPhysics: '',
  intenisty: 0,
  note: '',
};

export type FormData = z.infer<typeof FormSchema>;

export default function Layout({ children }: { children: React.ReactNode }) {
  const defaultStep = getCookieValue('food');
  const searchParams = useSearchParams();
  const diaryId = searchParams.get('id');

  const api = useTRPC();
  const queryClient = useQueryClient();

  const methods = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: async () => {
      if (diaryId) {
        const diaryData = await queryClient.fetchQuery({
          queryKey: ['diary.find', { id: diaryId }],
          queryFn: async () => {
            const allDiaries = await queryClient.fetchQuery(
              api.diaries.getAll.queryOptions({ type: 'food' }),
            );
            return allDiaries?.find((diary) => diary.id === diaryId);
          },
        });

        if (diaryData) {
          return diaryData.content as FormData;
        }
      }

      return defaultValues;
    },
  });

  return (
    <FormLayout
      type="food"
      steps={15}
      methods={methods}
      defaultStep={defaultStep}
      diaryId={diaryId}
    >
      {children}
    </FormLayout>
  );
}
