import { Skeleton } from '@/components/ui/sckeleton';

export const NewQuestionnaireLoader = () => (
  <div className="mx-auto grid h-[calc(100dvh-(--spacing(6))-(--spacing(32)))] w-full max-w-prose grid-rows-[auto_auto_1fr] space-y-4">
    <Skeleton className="h-16 w-full rounded-md" />
    <Skeleton className="h-16 w-full rounded-md" />
    <Skeleton className="h-full w-full rounded-md" />
  </div>
);
