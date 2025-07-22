'use client';

import { it } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { CaptionLabel, DayPicker, useDayPicker } from 'react-day-picker';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';

import { ScrollArea } from './scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState(new Date());
  return (
    <DayPicker
      lang="it"
      locale={it}
      month={month}
      onMonthChange={setMonth}
      fromYear={1900}
      toYear={new Date().getFullYear() + 1}
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        caption_dropdowns:
          'flex justify-center pt-1 relative items-center text-sm gap-2',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md',
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal aria-selected:opacity-100',
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn('h-4 w-4', className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn('h-4 w-4', className)} {...props} />
        ),
        CaptionLabel: (props) => {
          const {
            captionLayout,
            formatters: { formatMonthCaption },
            locale,
          } = useDayPicker();

          if (captionLayout !== 'dropdown-buttons')
            return <CaptionLabel {...props} />;
          const month = formatMonthCaption(props.displayMonth, { locale });
          return <span>{month}</span>;
        },
        Dropdown: (props) => {
          const { name, value, children } = props;

          if (name === 'months') return null;

          const yearOptions = React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null;
            if (child.type === 'option') {
              const childProps = child.props as {
                value: number;
                children: string;
              };
              const { value, children } = childProps;
              return (
                <SelectItem key={child.key} value={value.toString()}>
                  {children}
                </SelectItem>
              );
            }
          }) as React.ReactElement[];

          const changeHandler = (year: string) => {
            const currentMonth = month.getMonth();
            setMonth(new Date(`${year}-${currentMonth + 1}-01`));
          };

          return (
            <Select value={value?.toString()} onValueChange={changeHandler}>
              <SelectTrigger className="h-auto w-auto justify-start border-none p-0 shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="w-2[var(--radix-popper-anchor-width)] h-72 rounded-md">
                  {yearOptions}
                </ScrollArea>
              </SelectContent>
            </Select>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
