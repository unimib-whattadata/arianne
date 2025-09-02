'use client';

import type { RouterOutputs } from '@arianne/api';
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

const NotificationCard = () => {
  const api = useTRPC();

  const { data: dashboardNotifications, isLoading } = useQuery(
    api.notifications.latest.queryOptions(),
  );
  const latestNotifications = dashboardNotifications;
  const therapist = useQuery(api.therapists.getAllPatients.queryOptions());

  const queryClient = useQueryClient();
  const updateNotifications = useMutation(
    api.notifications.markAsRead.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: api.notifications.latest.queryKey(),
        });
        await queryClient.invalidateQueries({
          queryKey: api.notifications.all.queryKey(),
        });
      },
    }),
  );

  return (
    <Card>
      <CardHeader className="flex w-full flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Notifiche</CardTitle>
        <Link
          className="text-primary px-0 text-[14px] hover:underline"
          href="/notifiche"
        >
          Vedi tutti
        </Link>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">
            Caricamento notifiche...
          </p>
        ) : latestNotifications && latestNotifications.length > 0 ? (
          latestNotifications.map((notification: Notification) => {
            const patient = therapist.data?.find(
              (p) => p.id === notification.patientId,
            );
            const patientName = patient?.profile.firstName;

            return (
              <div
                key={notification.id}
                className="flex flex-row items-center justify-between"
              >
                <div className="flex flex-row items-center">
                  <Badge className="bg-primary/10 mr-4 flex h-10 w-10 items-center justify-center rounded-full text-white">
                    {getIconForType(notification.type)}
                  </Badge>

                  <div className="flex flex-col">
                    <div className="flex gap-1">
                      <p className="line-clamp-1 pr-1 text-base break-all">
                        {notification.title}:
                      </p>
                      <p className="font-semibold">
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
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground text-sm">
            Nessuna notifica recente
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
