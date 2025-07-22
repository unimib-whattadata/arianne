'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import type { CaptionProps } from 'react-day-picker';
import { DayPicker, useNavigation } from 'react-day-picker';

import { cn } from '@/utils/cn';

export type DiaryCalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  modifiers,
  modifiersStyles,
  ...props
}: DiaryCalendarProps) {
  const CustomCaption = ({ displayMonth }: CaptionProps) => {
    const { goToMonth, currentMonth } = useNavigation();

    const prevMonth = () =>
      goToMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
      );

    const nextMonth = () =>
      goToMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
      );

    const month = displayMonth.toLocaleString('it-IT', { month: 'long' });
    const year = displayMonth.getFullYear();

    return (
      <div className="flex items-center justify-between">
        <div className="flex gap-1 text-lg font-bold">
          <span className="text-[24px] capitalize text-[#2C3246]">{month}</span>
          <span className="text-[24px] text-forest-green-700">{year}</span>
        </div>
        <div className="flex items-center">
          <button onClick={prevMonth} className="h-7 w-7 text-[#2C3246]">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={nextMonth} className="h-7 w-7 text-[#2C3246]">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      weekStartsOn={1}
      formatters={{
        formatWeekdayName: (day) => {
          const italianDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
          return italianDays[day.getDay() === 0 ? 6 : day.getDay() - 1];
        },
      }}
      className={cn(className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-2 ',
        caption: 'flex justify-between items-center w-full ',
        caption_label: 'hidden',
        nav: 'hidden',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'text-center text-sm p-0 my-auto relative focus-within:relative focus-within:z-20',
        day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
        day_selected: 'bg-forest-green-700 text-[#ffff] rounded-full',
        day_today: 'bg-accent text-accent-foreground',
        day_outside: 'text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_start: 'aria-selected:bg-accent aria-selected:rounded-r-none',
        day_range_end: 'aria-selected:bg-accent aria-selected:rounded-l-none',
        day_range_middle:
          'aria-selected:bg-forest-green-700 aria-selected:rounded-none aria-selected:first:rounded-none aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Caption: CustomCaption,
      }}
      modifiers={modifiers}
      modifiersStyles={modifiersStyles}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
