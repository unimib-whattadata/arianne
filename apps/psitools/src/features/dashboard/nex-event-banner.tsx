'use client';

import { useQuery } from '@tanstack/react-query';
import {
  addDays,
  compareAsc,
  endOfDay,
  isToday,
  isTomorrow,
  isWithinInterval,
  startOfDay,
} from 'date-fns';
import { VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTherapist } from '@/hooks/use-therapist';
import { useTRPC } from '@/trpc/react';
import { cn } from '@/utils/cn';

const NextEventBanner = () => {
  const { user, isLoading } = useTherapist();
  const router = useRouter();
  const api = useTRPC();

  const { data: events, isLoading: loadingEvents } = useQuery(
    api.events.getAll.queryOptions(),
  );

  if (isLoading || !user || loadingEvents) return null;

  const _now = new Date();

  // Filter events for today and tomorrow
  const upcomingEvents = (events ?? []).filter((event) => {
    const startDate = new Date(event.date);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;

    const isStartingSoon = isToday(startDate) || isTomorrow(startDate);

    const isOngoing =
      compareAsc(startDate, _now) <= 0 && compareAsc(endDate, _now) >= 0;

    return isStartingSoon || isOngoing;
  });

  if (upcomingEvents.length === 0) {
    return (
      <Card className="h-full-safe w-full overflow-auto">
        <CardHeader className="sticky top-0 z-10 flex w-full flex-row items-center justify-between bg-white">
          <CardTitle className="text-base font-semibold">
            Prossimi eventi
          </CardTitle>
          <Link
            className="text-primary px-0 text-[14px] hover:underline"
            href="/agenda"
          >
            Vedi tutti
          </Link>
        </CardHeader>
        <CardContent className="text-muted-foreground py-4 text-center text-sm">
          Nessun evento in programma{' '}
        </CardContent>
      </Card>
    );
  }

  const sortedEvents = [...upcomingEvents].sort((a, b) =>
    compareAsc(new Date(a.date), new Date(b.date)),
  );

  return (
    <Card className="h-full-safe w-full max-w-[600px] overflow-auto">
      <CardHeader className="sticky top-0 z-10 flex w-full flex-row items-center justify-between bg-white">
        <CardTitle className="text-base font-semibold">
          Prossimi eventi
        </CardTitle>
        <Link
          className="text-primary px-0 text-[14px] hover:underline"
          href="/agenda"
        >
          Vedi tutti
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-between gap-3">
        {sortedEvents.map((event, index) => {
          const isAllDayOrMulti =
            event.isAllDay || (event.endDate && event.endDate > event.date);
          const label = (() => {
            const today = new Date();
            const tomorrow = addDays(today, 1);

            const startDate = new Date(event.date);
            const endDate = event.endDate ? new Date(event.endDate) : startDate;

            const todayInRange = isWithinInterval(today, {
              start: startOfDay(startDate),
              end: endOfDay(endDate),
            });

            const tomorrowInRange = isWithinInterval(tomorrow, {
              start: startOfDay(startDate),
              end: endOfDay(endDate),
            });

            if (todayInRange) return 'Oggi';
            if (tomorrowInRange) return 'Domani';
            return '';
          })();
          const time = isAllDayOrMulti
            ? ''
            : event.startTime
              ? event.startTime
              : '';

          const patientsName = event.participants
            .filter((p) => p.patientId)
            .map((p) => p.patient.profile.name);

          const title =
            patientsName.length > 1
              ? `${event.name} (${patientsName.join(', ')})`
              : patientsName[0] || event.name;

          const showButton = Boolean(event.meetingLink);

          return (
            <Card
              key={event.id}
              className={cn(
                'bg-background w-full cursor-pointer hover:bg-[#EFF3F7]',
                index === 0 ? 'border-primary/50 border' : 'border-none',
              )}
              onClick={() => {
                router.push(`/agenda?eventId=${event.id}`);
              }}
            >
              <CardHeader className="flex w-full flex-row items-center justify-between space-y-0 p-3">
                <CardTitle className="text-base font-normal">{title}</CardTitle>
                <Badge className="text-primary px-0 text-xs" variant="default">
                  {time ? `${label}, ${time}` : label}
                </Badge>
              </CardHeader>
              <CardContent
                className={cn('w-full p-0 px-3', showButton && 'pb-3')}
              >
                {event.description && (
                  <div
                    className="mb-3 block truncate text-xs text-ellipsis"
                    dangerouslySetInnerHTML={{
                      __html: event.description,
                    }}
                  />
                )}
                {showButton && (
                  <Button
                    variant={index === 0 ? 'default' : 'outline'}
                    className={cn(
                      'w-full gap-2 text-[14px]',
                      index === 0 ? '' : 'bg-background',
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(event.meetingLink!, '_blank');
                    }}
                  >
                    <VideoIcon className="h-4 w-4" /> Partecipa
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default NextEventBanner;
