import { Skeleton } from '@/components/ui/sckeleton';

export const NewQuestionnaireLoader = () => (
  <div className="mx-auto grid h-[calc(100dvh_-_theme(spacing.6)_-_theme(spacing.32))] w-full max-w-prose grid-rows-[auto,auto,1fr] space-y-4">
    <Skeleton className="h-16 w-full rounded-md" />
    <Skeleton className="h-16 w-full rounded-md" />
    <Skeleton className="h-full w-full rounded-md" />
  </div>
);
