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
  bheavior: z.string().optional(),
  bodyFeeling: z.string().optional(),
  company: z.string().optional(),
  commento: z.string().optional(),
  companyPerson: z.string().optional(),
  consumption: z.string().optional(),
  context: z.string().optional(),
  description: z.string().optional(),
  emotion: z.string().optional(),
  intensity: z.number().optional(),
  momentDay: z.string().optional(),
  place: z.string().optional(),
  feeling: z.string().optional(),
  thought: z.string().optional(),
  unpleasant: z.string().optional(),
  note: z.string().optional(),
  bodyEmotion: z.string().optional(),
});

const defaultValues = {
  bheavior: '',
  bodyFeeling: '',
  bodyEmotion: '',
  company: '',
  commento: '',
  companyPerson: '',
  consumption: '',
  context: '',
  description: '',
  emotion: '',
  intensity: 0,
  momentDay: ' ',
  place: '',
  feeling: '',
  thought: '',
  unpleasant: '',
  note: '',
};

export type FormData = z.infer<typeof FormSchema>;

export default function Layout({ children }: { children: React.ReactNode }) {
  const defaultStep = getCookieValue('cognitive_beahvioral');
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
              api.diary.getAll.queryOptions({ type: 'cognitive_beahvioral' }),
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
      type="cognitive_beahvioral"
      steps={12}
      methods={methods}
      defaultStep={defaultStep}
      diaryId={diaryId}
    >
      {children}
    </FormLayout>
  );
}
