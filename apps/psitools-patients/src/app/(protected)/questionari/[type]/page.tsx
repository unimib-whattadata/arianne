'use client';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { AdministrationProvider } from '@/features/questionnaires/context/administration';
import type { available } from '@/features/questionnaires/settings';

export const NewQuestionnaireLoader = () => (
  <div className="mx-auto grid h-[calc(100dvh_-_theme(spacing.6)_-_theme(spacing.32))] w-full max-w-prose grid-rows-[auto,auto,1fr] space-y-4">
    <Skeleton className="h-16 w-full rounded-md" />
    <Skeleton className="h-16 w-full rounded-md" />
    <Skeleton className="h-full w-full rounded-md" />
  </div>
);

const getContent = (type: (typeof available)[number]) => {
  if (!type) return NewQuestionnaireLoader;
  return dynamic(() => import(`@/features/questionnaires/${type}/new`), {
    loading: NewQuestionnaireLoader,
  });
};

export default function Page() {
  const params = useParams();
  const { type } = params as { type: (typeof available)[number] };
  const Questionnaires = getContent(type);
  return (
    <AdministrationProvider>
      <Questionnaires />
    </AdministrationProvider>
  );
}
