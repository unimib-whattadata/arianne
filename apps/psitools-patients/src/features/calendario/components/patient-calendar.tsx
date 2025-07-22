'use client';
import type { Event } from '@prisma/client';
import { useState } from 'react';

import { PatientCalendarAppointments } from '@/features/calendario/components/patient-calendar-appointments';
import { PatientCalendarHeader } from '@/features/calendario/components/patient-calendar-header';
import { PatientCalendarMonth } from '@/features/calendario/components/patient-calendar-month';
import { PatientCalendarWeek } from '@/features/calendario/components/patient-calendar-week';
import type { Day, Month, Week } from '@/features/calendario/types';
import {
  getCurrentDayObject,
  getCurrentMonth,
  getCurrentYear,
  getISOWeekNumber,
  getISOWeeksInYear,
  getMonth,
  getMonthIndexFromWeek,
  getWeek,
} from '@/features/calendario/utils';

interface PatientCalendarProps {
  events: Event[];
}

export const PatientCalendar = (props: PatientCalendarProps) => {
  const { events } = props;
  const [view, setView] = useState<'week' | 'month'>('week');
  const [month, setMonth] = useState<Month>(
    getMonth(events, getCurrentMonth(), getCurrentYear()),
  );
  const [week, setWeek] = useState<Week>(
    getWeek(
      getISOWeekNumber(new Date()),
      getCurrentMonth(),
      getCurrentYear(),
      events,
    ),
  );

  const [selectedDay, setSelectedDay] = useState<Day>(
    getCurrentDayObject(events),
  );

  const onClickPrevious = () => {
    switch (view) {
      case 'month':
        setMonth((prev) => {
          if (prev.monthNumber == 1) {
            return getMonth(events, 12, prev.year - 1);
          }
          return getMonth(events, prev.monthNumber - 1, prev.year);
        });
        break;
      case 'week':
        setWeek((prev) => {
          if (prev.weekNumber == 1) {
            const weekInYear = getISOWeeksInYear(prev.year - 1);
            return getWeek(weekInYear, 12, prev.year - 1, events);
          }
          const month =
            getMonthIndexFromWeek(prev.year, prev.weekNumber - 1) + 1;
          return getWeek(prev.weekNumber - 1, month, prev.year, events);
        });
    }
  };

  const onClickNext = () => {
    switch (view) {
      case 'month':
        setMonth((prev) => {
          if (prev.monthNumber == 12) {
            return getMonth(events, 1, prev.year + 1);
          }
          return getMonth(events, prev.monthNumber + 1, prev.year);
        });
        break;
      case 'week':
        setWeek((prev) => {
          const weekInYear = getISOWeeksInYear(prev.year);
          if (prev.weekNumber == weekInYear) {
            return getWeek(1, 1, prev.year + 1, events);
          }
          const month =
            getMonthIndexFromWeek(prev.year, prev.weekNumber + 1) + 1;
          return getWeek(prev.weekNumber + 1, month, prev.year, events);
        });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        {/* Calendar Header*/}
        <PatientCalendarHeader
          month={month}
          week={week}
          view={view}
          setView={setView}
          onClickNext={onClickNext}
          onClickPrevious={onClickPrevious}
        />
        {/* Week View */}
        {view == 'week' && (
          <PatientCalendarWeek week={week} setSelectedDay={setSelectedDay} />
        )}
        {/* Month View */}
        {view == 'month' && (
          <PatientCalendarMonth month={month} setSelectedDay={setSelectedDay} />
        )}
      </div>
      {/* Appointments */}
      <PatientCalendarAppointments day={selectedDay} />
    </div>
  );
};
