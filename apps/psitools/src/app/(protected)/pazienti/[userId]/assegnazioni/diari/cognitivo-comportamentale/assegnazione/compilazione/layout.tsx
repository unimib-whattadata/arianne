'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import type React from 'react';
import { useForm } from 'react-hook-form';

import type { FormData } from '@/features/diaries/cognitive-behavioral/schema';
import {
  defaultValues,
  FormSchema,
} from '@/features/diaries/cognitive-behavioral/schema';
import { FormLayout } from '@/features/diaries/components/form-layout';
import { useTRPC } from '@/trpc/react';
import { getCookieValue } from '@/utils/get-cookie-value';

export default function Layout({ children }: { children: React.ReactNode }) {
  const defaultStep = getCookieValue('cognitive_behavioral');
  const searchParams = useSearchParams();
  const diaryId = searchParams.get('id');

  const api = useTRPC();
  const queryClient = useQueryClient();

  const methods = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: async () => {
      if (diaryId) {
        try {
          const diaryData = await queryClient.fetchQuery({
            queryKey: ['diary.find', { id: diaryId }],
            queryFn: async () => {
              const allDiaries = await queryClient.fetchQuery(
                api.diaries.getAll.queryOptions({
                  type: 'cognitive_behavioral',
                }),
              );

              const foundDiary = allDiaries?.find(
                (diary) => diary.id === diaryId,
              );

              return foundDiary || null;
            },
          });

          if (diaryData?.content) {
            return diaryData.content as FormData;
          }
        } catch (error) {
          console.error('Error fetching diary data:', error);
        }
      }

      return defaultValues;
    },
  });

  return (
    <FormLayout
      type="cognitive_behavioral"
      steps={12}
      methods={methods}
      defaultStep={defaultStep}
      diaryId={diaryId}
    >
      {children}
    </FormLayout>
  );
}
