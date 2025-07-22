import {
  addDays,
  addMonths,
  addWeeks,
  format,
  subMonths,
  subWeeks,
} from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NavigationBarProps {
  view: 'month' | 'week' | 'day';
  currentDate: Date;
  selectedDate: Date;
  setView: (view: 'month' | 'week' | 'day') => void;
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  view,
  currentDate,
  selectedDate,
  setView,
  setCurrentDate,
  setSelectedDate,
}) => {
  const isMonthView = view === 'month';
  const isWeekView = view === 'week';
  const isDayView = view === 'day';

  const handlePrev = () => {
    if (isMonthView) setCurrentDate(subMonths(currentDate, 1));
    if (isWeekView) setSelectedDate(subWeeks(selectedDate, 1));
    if (isDayView) setSelectedDate(addDays(selectedDate, -1));
  };

  const handleNext = () => {
    if (isMonthView) setCurrentDate(addMonths(currentDate, 1));
    if (isWeekView) setSelectedDate(addWeeks(selectedDate, 1));
    if (isDayView) setSelectedDate(addDays(selectedDate, 1));
  };

  const formattedTitle = isMonthView
    ? format(currentDate, 'MMMM yyyy', { locale: it })
    : isWeekView
      ? `${format(selectedDate, ' MMMM yyyy', { locale: it })} `
      : format(selectedDate, ' MMMM yyyy', { locale: it });

  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-primary first-letter:uppercase">
        {formattedTitle}
      </h2>

      <div className="flex items-center gap-2">
        <Select
          value={view}
          onValueChange={(value) => setView(value as 'month' | 'week' | 'day')}
        >
          <SelectTrigger className="w-[150px] border-[0.5px] border-primary/50 text-base text-primary">
            <SelectValue placeholder="Mese" />
          </SelectTrigger>
          <SelectContent className="text-sm">
            <SelectItem value="month">Mese</SelectItem>
            <SelectItem value="week">Settimana</SelectItem>
            <SelectItem value="day">Giorno</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            const today = new Date();
            setCurrentDate(today);
            setSelectedDate(today);
          }}
          className="text-base"
        >
          Oggi
        </Button>
        <div className="ml-5 flex gap-5">
          <Button
            variant="ghost"
            className="p-0 text-primary"
            onClick={handlePrev}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            onClick={handleNext}
            className="p-0 text-primary"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
