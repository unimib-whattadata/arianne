'use client';

import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/cn';

type Props = {
  date?: DateRange;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
} & React.HTMLAttributes<HTMLDivElement>;

export function DatePickerWithRange({ className, date, setDate }: Props) {
  // const [date, setDate] = React.useState<DateRange | undefined>();

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            size="default"
            className={cn(
              'font-default hover:bg-whit flex w-full items-center justify-between rounded-md border border-primary bg-card px-2.5 py-2 text-slate-500 hover:bg-white-900 hover:text-slate-300 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:bg-card',
              date?.from && 'text-space-gray',
              className,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y', { locale: it })} -{' '}
                  {format(date.to, 'LLL dd, y', { locale: it })}
                </>
              ) : (
                format(date.from, 'LLL dd, y', { locale: it })
              )
            ) : (
              <span>Seleziona un periodo</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={it}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
