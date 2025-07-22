import type { Dispatch, SetStateAction } from 'react';

import { PatientCalendarDay } from '@/features/calendario/components/patient-calendar-day';
import type { Day, Month } from '@/features/calendario/types';
import { isToday } from '@/features/calendario/utils';
import { cn } from '@/lib/utils';

interface PatientCalendarMonthProps {
  month: Month;
  setSelectedDay: Dispatch<SetStateAction<Day>>;
}

export const PatientCalendarMonth = (props: PatientCalendarMonthProps) => {
  const { month, setSelectedDay } = props;
  return (
    <div className="grid grid-cols-7 gap-4">
      {month.monthSpan > 0 && (
        <div
          className={cn(
            `col-span-${String(month.monthSpan)} p-4 text-center text-sm`,
          )}
        ></div>
      )}
      {month.days.map((day, index) => (
        <PatientCalendarDay
          key={index}
          day={day}
          currentDay={isToday(day.dayNumber, month.monthNumber, month.year)}
          setSelectedDay={setSelectedDay}
        />
      ))}
    </div>
  );
};
