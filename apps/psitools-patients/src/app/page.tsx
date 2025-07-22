import { DayAppointments } from '@/app/_components/dayAppointments';
import { Diaries } from '@/app/_components/home-diaries';
import { HomeHeader } from '@/app/_components/home-header';
import { HomeImportant as _HomeImportant } from '@/app/_components/home-important';
import { Tasks } from '@/app/_components/home-tasks';
import { HydrateClient } from '@/trpc/server';

export default function Page() {
  return (
    <HydrateClient>
      <div className="flex flex-col gap-8 px-24 py-6">
        {/* Profile Title */}
        <HomeHeader />
        {/* Important Section */}
        {/* <HomeImportant /> */}
        {/* La tua giornata */}
        <DayAppointments />
        {/* Compiti Assegnati */}
        <Tasks />
        {/* Diari da compilare */}
        <Diaries />
      </div>
    </HydrateClient>
  );
}
