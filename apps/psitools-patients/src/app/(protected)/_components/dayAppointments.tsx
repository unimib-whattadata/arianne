'use client';
import { useQuery } from '@tanstack/react-query';
import { Pill, Sofa } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTRPC } from '@/trpc/react';

interface DayAppointmentProps {
  title: string;
  type: 'appointment' | 'medicine';
  startDate: string | null;
  endDate: string | null;
}

const DayAppointment = (props: DayAppointmentProps) => {
  const { title, type, startDate, endDate } = props;
  return (
    <Card className="bg-blue-water grid flex-1 grid-cols-[auto,1fr] items-center gap-2 p-3 pr-4">
      {type == 'appointment' && (
        <div className="items-center justify-center rounded-full bg-pink-200 p-2">
          <Sofa />
        </div>
      )}
      {type == 'medicine' && (
        <div className="items-center justify-center rounded-full bg-blue-200 p-2">
          <Pill />
        </div>
      )}
      <div>
        <h3 className="text-blue-waterTitle text-base font-semibold">
          {title}
        </h3>
        {startDate && endDate && (
          <p className="text-xs">
            {startDate}-{endDate}
          </p>
        )}
      </div>
    </Card>
  );
};

export const DayAppointments = () => {
  const api = useTRPC();
  const { data: events } = useQuery(
    api.events.getAll.queryOptions({
      who: 'patient',
    }),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEvents =
    events?.filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);

      return eventDate.getTime() === today.getTime();
    }) || [];

  return (
    <section className="grid grid-cols-1 gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold first:mt-0">La tua giornata</h2>
        <Link href="/calendario">
          <Button variant="link" className="text-blue-waterTitle">
            Vai al calendario
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {todayEvents.length > 0 ? (
          todayEvents.map((event, index) => (
            <DayAppointment
              key={index}
              startDate={event.startTime}
              endDate={event.endTime}
              title={event.name}
              type="appointment"
            />
          ))
        ) : (
          <p className="text-center">Nessun Appuntamento</p>
        )}
      </div>
    </section>
  );
};
