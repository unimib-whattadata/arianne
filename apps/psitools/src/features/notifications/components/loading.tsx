import { Skeleton } from '@/components/ui/skeleton';

export const Loading = () => (
  <div className="grid h-fit w-full gap-2">
    <Skeleton className="h-24 w-full rounded-md" />
    <Skeleton className="h-24 w-full rounded-md" />
    <Skeleton className="h-24 w-full rounded-md" />
  </div>
);
