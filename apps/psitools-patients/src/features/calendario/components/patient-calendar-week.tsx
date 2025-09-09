import type { Dispatch, SetStateAction } from 'react';

import { PatientCalendarDay } from '@/features/calendario/components/patient-calendar-day';
import type { Day, Week } from '@/features/calendario/types';
import { isToday } from '@/features/calendario/utils';

interface PatientCalendarWeekProps {
  week: Week;
  setSelectedDay: Dispatch<SetStateAction<Day>>;
}

export const PatientCalendarWeek = (props: PatientCalendarWeekProps) => {
  const { week, setSelectedDay } = props;
  return (
    <div className="grid grid-cols-7 gap-4">
      {week.days.map((day, index) => (
        <PatientCalendarDay
          key={index}
          day={day}
          currentDay={isToday(day.dayNumber, week.monthNumber, week.year)}
          setSelectedDay={setSelectedDay}
        />
      ))}
    </div>
  );
};
