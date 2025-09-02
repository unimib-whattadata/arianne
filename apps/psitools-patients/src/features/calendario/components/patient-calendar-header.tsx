import { ChevronLeft, ChevronRight, Columns4, Grid3X3 } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

import type { Month, Week } from '@/features/calendario/types';
import { daysOfWeek } from '@/features/calendario/utils';
// Header
interface PatientCalendarHeaderProps {
  view: 'week' | 'month';
  onClickPrevious: () => void;
  onClickNext: () => void;
  setView: Dispatch<SetStateAction<'week' | 'month'>>;
  month: Month;
  week: Week;
}

export const PatientCalendarHeader = (props: PatientCalendarHeaderProps) => {
  const { month, week, view, setView, onClickPrevious, onClickNext } = props;
  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <span className="text-lg font-bold capitalize">
            {view == 'month'
              ? `${month.name} ${month.year}`
              : `${week.monthName} ${week.year}`}
          </span>
          <div className="flex flex-row">
            <ChevronLeft className="cursor-pointer" onClick={onClickPrevious} />
            <ChevronRight className="cursor-pointer" onClick={onClickNext} />
          </div>
        </div>
        {view == 'week' ? (
          <Grid3X3
            className="cursor-pointer"
            onClick={() => setView('month')}
            height={25}
            width={25}
          />
        ) : (
          <Columns4
            className="cursor-pointer"
            onClick={() => setView('week')}
            height={25}
            width={25}
          />
        )}
      </div>
      {/* Header Days */}
      <div className="grid grid-cols-7 gap-4">
        {daysOfWeek.map((day) => (
          <div key={day.index} className="p-4 text-center text-sm font-bold">
            {day.abbr}
          </div>
        ))}
      </div>
    </div>
  );
};
