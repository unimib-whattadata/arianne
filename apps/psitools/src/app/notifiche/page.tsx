'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { Loading } from '@/features/notifications/components/loading';
import { NotificationsTable } from '@/features/notifications/table';
import { SettingsBar } from '@/features/notifications/table/settings';
import { useColumns } from '@/features/notifications/table/use-columns';
import { useTRPC } from '@/trpc/react';

export default function NotificationsPage() {
  const api = useTRPC();

  const { data: dashboardNotifications, isLoading } = useQuery(
    api.dashboardNotifications.all.queryOptions(),
  );

  const { data: patients } = useQuery(
    api.therapist.getAllPatients.queryOptions(),
  );

  const patientMap = useMemo(() => {
    if (!patients) return new Map<string, string>();
    return new Map(patients.map((p) => [p.id, p.user?.name ?? p.id]));
  }, [patients]);

  const columns = useColumns(patientMap);
  if (!columns) return null;

  return (
    <main className="relative grid h-full-safe grid-rows-[auto_auto_auto_1fr_auto] gap-3 p-4">
      <h1 className="mb-3 text-2xl font-semibold">Notifiche</h1>
      <div className="flex w-full flex-col gap-4"></div>
      <SettingsBar />
      {!dashboardNotifications || isLoading ? (
        <Loading />
      ) : (
        <NotificationsTable columns={columns} data={dashboardNotifications} />
      )}
    </main>
  );
}
