import type { RouterOutputs } from '@arianne/api';

type Events = RouterOutputs['events']['getAllForPatients'];

export type DayName =
  | 'lunedì'
  | 'martedì'
  | 'mercoledì'
  | 'giovedì'
  | 'venerdì'
  | 'sabato'
  | 'domenica';
export type DayAbbr = 'lun' | 'mar' | 'mer' | 'gio' | 'ven' | 'sab' | 'dom';
export type MonthName =
  | 'gennaio'
  | 'febbraio'
  | 'marzo'
  | 'aprile'
  | 'maggio'
  | 'giugno'
  | 'luglio'
  | 'agosto'
  | 'settembre'
  | 'ottobre'
  | 'novembre'
  | 'dicembre';

// Day Schema
export interface Day {
  name: DayName;
  dayNumber: number; // Range -> (1-31)
  dayIndex: number; // Range -> 0 (Monday) to 6 (Sunday)
  abbr: DayAbbr;
  date: Date;
  appointments: Events;
}

export interface Week {
  days: Day[];
  weekNumber: number;
  monthNumber: number;
  monthName: string;
  year: number;
}
export interface Month {
  name: MonthName;
  days: Day[];
  monthSpan: number;
  monthNumber: number; // 1-12
  year: number;
}

export type CalendarView = 'week' | 'month';
