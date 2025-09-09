'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { FormLayout } from '@/features/diaries/components/form-layout';
import type { FormData } from '@/features/diaries/sleep-morning/schema';
import {
  defaultValues,
  FormSchema,
} from '@/features/diaries/sleep-morning/schema';
import { useTRPC } from '@/trpc/react';
import { getCookieValue } from '@/utils/get-cookie-value';

export default function Layout({ children }: { children: React.ReactNode }) {
  const defaultStep = getCookieValue('sleep_morning');
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
              api.diaries.getAll.queryOptions({ type: 'sleep_morning' }),
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
      }

      return defaultValues;
    },
  });

  return (
    <FormLayout
      type="sleep_morning"
      steps={22}
      methods={methods}
      defaultStep={defaultStep}
      diaryId={diaryId}
    >
      {children}
    </FormLayout>
  );
}
