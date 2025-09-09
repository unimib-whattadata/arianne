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
            variant="input"
            className={cn('border-primary', !date && 'text-muted-foreground')}
          >
            <CalendarIcon className="h-4 w-4" />
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
