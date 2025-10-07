'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { CaptionLabel, DayPicker, useDayPicker } from 'react-day-picker';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { ScrollArea } from './scroll-area';
import { it } from 'date-fns/locale';

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
        month: 'space-y-4 text-sm',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        caption_dropdowns:
          'flex justify-center pt-1 relative items-center text-sm gap-2',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-primary',
        ),
        nav_button_previous: 'absolute left-1 ',
        nav_button_next: 'absolute right-1 ',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'text-center text-sm p-0 my-auto relative focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
        ),
        day_selected:
          'bg-primary text-accent-foreground text-primary-foreground hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'border border-primary',
        day_outside: 'text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_start: 'aria-selected:bg-accent aria-selected:rounded-r-none',
        day_range_end: 'aria-selected:bg-accent aria-selected:rounded-l-none',
        day_range_middle:
          'aria-selected:bg-primary-200/40 aria-selected:rounded-none aria-selected:first:rounded-none aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="h-4 w-4" {...props} />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className="h-4 w-4" {...props} />
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
              <SelectTrigger className="mt-0 w-auto justify-start rounded-md border-none px-2 py-0 text-sm shadow-none focus:ring-0">
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
