'use client';

import type { Notifications } from '@arianne/db';
import type { NotificationType } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTRPC } from '@/trpc/react';

const getIconForType = (type: NotificationType) => {
  switch (type) {
    case 'event_cancelled':
    case 'event_modified':
      return <Calendar1 className="size-6 text-primary" />;
    case 'task_completed':
      return <NotepadText className="size-6 text-primary" />;
    case 'administration_completed':
      return <Sticker className="size-6 text-primary" />;
    case 'diary_completed':
      return <BookHeart className="size-6 text-primary" />;
  }
};

const NotificationCard = () => {
  const api = useTRPC();

  const { data: dashboardNotifications, isLoading } = useQuery(
    api.dashboardNotifications.latest.queryOptions(),
  );
  const latestNotifications = dashboardNotifications as Notifications[];
  const therapist = useQuery(api.therapist.getAllPatients.queryOptions());

  const queryClient = useQueryClient();
  const updateNotifications = useMutation(
    api.dashboardNotifications.markAsRead.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: api.dashboardNotifications.latest.queryKey(),
        });
        await queryClient.invalidateQueries({
          queryKey: api.dashboardNotifications.all.queryKey(),
        });
      },
    }),
  );

  return (
    <Card>
      <CardHeader className="flex w-full flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Notifiche</CardTitle>
        <Link
          className="px-0 text-[14px] text-primary hover:underline"
          href="/notifiche"
        >
          Vedi tutti
        </Link>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">
            Caricamento notifiche...
          </p>
        ) : latestNotifications && latestNotifications.length > 0 ? (
          latestNotifications.map((notification: Notifications) => {
            const patient = therapist.data?.find(
              (p) => p.id === notification.patientId,
            );
            const patientName = patient?.user?.name ?? '';

            return (
              <div
                key={notification.id}
                className="flex flex-row items-center justify-between"
              >
                <div className="flex flex-row items-center">
                  <Badge className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-white">
                    {getIconForType(notification.type)}
                  </Badge>

                  <div className="flex flex-col">
                    <div className="flex gap-1">
                      <p className="line-clamp-1 break-all pr-1 text-base">
                        {notification.title}:
                      </p>
                      <p className="font-semibold">
                        {notification.description}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground first-letter:uppercase">
                      {formatDistanceToNow(new Date(notification.date), {
                        addSuffix: true,
                        locale: it,
                      })}{' '}
                      da{' '}
                      <Link
                        href={`/pazienti/${notification.patientId ?? ''}`}
                        className="text-primary hover:underline"
                      >
                        {patientName || notification.patientId}
                      </Link>
                    </p>
                  </div>
                </div>

                <div className="flex flex-row items-center gap-2">
                  {notification.type === 'event_cancelled' && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-sm"
                    >
                      <Link href="/agenda">Riprogramma</Link>
                    </Button>
                  )}
                  <Button
                    variant={notification.read ? 'outline' : 'default'}
                    size="sm"
                    className="w-fit border-[1px] border-primary"
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
                      <Mail className="border-1 text-white" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">
            Nessuna notifica recente
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
