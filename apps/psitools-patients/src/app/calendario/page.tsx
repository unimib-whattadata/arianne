'use client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { PatientCalendar } from '@/features/calendario/components/patient-calendar';
import { useTRPC } from '@/trpc/react';

export default function Page() {
  const api = useTRPC();
  const { data: events } = useQuery(
    api.event.getAll.queryOptions({
      who: 'patient',
    }),
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h2 className="text-center text-xl font-semibold first:mt-0">
        Calendario
      </h2>
      {events ? (
        <PatientCalendar events={events} />
      ) : (
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
