'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MailOpen, Settings } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/react';

export const SettingsBar = <_TData,>() => {
  const api = useTRPC();
  const queryClient = useQueryClient();

  const { data: dashboardNotifications } = useQuery(
    api.dashboardNotifications.all.queryOptions(),
  );

  const unreadCount = useMemo(() => {
    return dashboardNotifications?.filter((n) => !n.read).length ?? 0;
  }, [dashboardNotifications]);

  const markAllAsRead = useMutation(
    api.dashboardNotifications.markAllAsRead.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: api.dashboardNotifications.all.queryKey(),
        });
      },
    }),
  );

  return (
    <div className="relative flex items-center justify-between gap-2">
      <Link
        href="/impostazioni"
        className="w-11 rounded-md border-[1px] border-primary bg-background p-2 text-primary"
      >
        <Settings className="m-auto h-4 w-4" />
      </Link>

      <Button
        variant={unreadCount === 0 ? 'outline' : 'default'}
        onClick={() => markAllAsRead.mutate()}
        className={unreadCount === 0 ? 'pointer-events-none opacity-50' : ''}
      >
        <MailOpen />
        <p className="text-[14px] font-thin">Segna tutti come letti</p>
      </Button>
    </div>
  );
};
