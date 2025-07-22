import type { Dispatch, SetStateAction } from 'react';

import type { Day } from '@/features/calendario/types';
import { cn } from '@/lib/utils';

interface PropsCalendarDay {
  day: Day;
  currentDay: boolean;
  setSelectedDay: Dispatch<SetStateAction<Day>>;
}
export const PatientCalendarDay = (props: PropsCalendarDay) => {
  const { day, currentDay, setSelectedDay } = props;
  return (
    <div
      className="flex cursor-pointer flex-col items-center justify-center gap-2"
      onClick={() => setSelectedDay(day)}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          currentDay ? 'bg-orange-200' : '',
        )}
      >
        <span className="text-center text-sm">{day.dayNumber}</span>
      </div>
      <div className="relative h-5 w-8">
        {day.appointments.length > 0 && (
          <div className="absolute left-1.5 h-5 w-5 rounded-full bg-pink-300" />
        )}
        {/*<div className="absolute left-3 h-5 w-5 rounded-full bg-blue-300" /> */}
      </div>
    </div>
  );
};
