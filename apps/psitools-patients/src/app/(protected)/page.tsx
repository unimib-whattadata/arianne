import { DayAppointments } from '@/app/(protected)/_components/dayAppointments';
import { Diaries } from '@/app/(protected)/_components/home-diaries';
import { HomeHeader } from '@/app/(protected)/_components/home-header';
import { HomeImportant as _HomeImportant } from '@/app/(protected)/_components/home-important';
import { Tasks } from '@/app/(protected)/_components/home-tasks';

export default function Page() {
  return (
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
  );
}
