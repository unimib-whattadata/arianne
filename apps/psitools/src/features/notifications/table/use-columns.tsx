import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  BookHeart,
  Calendar1,
  Mail,
  MailOpen,
  NotepadText,
  Sticker,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/react';
import type { RouterOutputs } from '@arianne/api';

type Notifications = RouterOutputs['notifications']['latest'];
type Notification = Notifications[number];

const getIconForType = (type: Notification['type']) => {
  switch (type) {
    case 'event_cancelled':
    case 'event_modified':
      return <Calendar1 className="text-primary size-6" />;
    case 'task_completed':
      return <NotepadText className="text-primary size-6" />;
    case 'administration_completed':
      return <Sticker className="text-primary size-6" />;
    case 'diary_completed':
      return <BookHeart className="text-primary size-6" />;
  }
};

export const useColumns = (patientMap: Map<string, string>) => {
  const api = useTRPC();
  const queryClient = useQueryClient();
  const updateNotifications = useMutation(
    api.notifications.markAsRead.mutationOptions({
      onSuccess: async () => {
        console.log('Notifica aggiornata con successo');
        await queryClient.invalidateQueries({
          queryKey: api.notifications.all.queryKey(),
        });
        await queryClient.invalidateQueries({
          queryKey: api.notifications.latest.queryKey(),
        });
      },
    }),
  );

  return useMemo<ColumnDef<Notification>[]>(
    () => [
      {
        id: 'badge',
        cell: ({ row }) => {
          const notification = row.original;
          return (
            <Badge className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full text-white">
              {getIconForType(notification.type)}
            </Badge>
          );
        },
      },
      {
        id: 'info',
        cell: ({ row }) => {
          const notification = row.original;
          const patientName =
            patientMap.get(notification.patientId ?? '') ?? '';

          return (
            <div className="flex flex-col">
              <div className="flex gap-1">
                <p className="line-clamp-1 pr-1 text-base break-all">
                  {notification.title}:
                </p>
                <p className="text-base font-semibold">
                  {notification.description}
                </p>
              </div>

              <p className="text-muted-foreground text-sm first-letter:uppercase">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                  locale: it,
                })}{' '}
                da{' '}
                <Link
                  href={`/pazienti/${notification.patientId ?? ''}`}
                  className="text-primary hover:underline"
                >
                  {patientName}
                </Link>
              </p>
            </div>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const notification = row.original;
          if (!notification?.id) return null;

          return (
            <div className="flex flex-row items-center justify-end gap-2">
              {notification.type === 'event_cancelled' && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-base"
                >
                  <Link href="/agenda">Riprogramma</Link>
                </Button>
              )}
              <Button
                variant={notification.read ? 'outline' : 'default'}
                size="sm"
                className="border-primary w-fit border"
                onClick={() =>
                  updateNotifications.mutate({
                    id: notification.id,
                    currentRead: notification.read,
                  })
                }
              >
                {notification.read ? (
                  <MailOpen className="text-primary" />
                ) : (
                  <Mail className="border text-white" />
                )}
              </Button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [patientMap],
  );
};
