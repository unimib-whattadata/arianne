import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTherapist } from '@/hooks/use-therapist';
import { useTRPC } from '@/trpc/react';
import { cn } from '@/utils/cn';
import type { RouterOutputs } from '@arianne/api';

type TNote = RouterOutputs['notes']['findUnique'];

interface Props {
  note: TNote;
  className?: string;
}

export const NoteCard = (props: Props) => {
  const { user: therapist, isLoading } = useTherapist();
  const pathname = usePathname();

  const api = useTRPC();
  const queryClient = useQueryClient();
  const updateNote = useMutation(
    api.notes.update.mutationOptions({
      onSettled: () => {
        return queryClient.invalidateQueries(api.notes.findMany.queryFilter());
      },
    }),
  );

  if (isLoading) return null;

  const togglePinned = () => {
    return updateNote.mutate({
      where: {
        id: note.id,
      },
      data: {
        pinned: !note.pinned,
      },
    });
  };

  const { note } = props;
  const { id, title, date, pinned } = note;
  return (
    <Card key={id} className="flex items-center gap-2">
      <CardHeader className="space-y-0">
        <CardTitle className="line-clamp-1 pr-1 text-base break-all">
          {title}
        </CardTitle>
        <CardDescription>
          Creata il{' '}
          <span className="text-primary">
            {format(date, 'P', { locale: it })}
          </span>{' '}
          da{' '}
          <span className="text-primary">{therapist?.profile?.name}</span>{' '}
        </CardDescription>
      </CardHeader>
      <CardFooter className="ml-auto flex items-center gap-2 pt-4">
        <Button variant="ghost" size="icon" onClick={togglePinned}>
          <Star className={cn('text-primary', pinned ? 'fill-primary' : '')} />
        </Button>
        <Button asChild>
          <Link href={`${pathname}/${id}`}>Apri</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
