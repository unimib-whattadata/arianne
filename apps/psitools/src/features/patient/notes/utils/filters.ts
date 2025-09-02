import type { RouterOutputs } from '@arianne/api';
import { addDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';

type TNote = RouterOutputs['notes']['findUnique'];

export const titleFilter = (note: TNote, search: string) => {
  if (!search) return true;
  return note.title.toLowerCase().includes(search.toLowerCase());
};
export const dateFilter = (note: TNote, date: DateRange | undefined) => {
  if (!date?.from || !date.to) return true;
  if (note.date >= date.from && note.date <= date.to) {
    console.log({ note: note.date, date });
  }
  return note.date >= date.from && note.date <= addDays(date.to, 1);
};

export const pinnedFilter = (note: TNote, pinned: boolean | string) => {
  if (!pinned) return true;
  return note.pinned;
};

const orderDesc = (a: TNote, b: TNote) => {
  if (a.date > b.date) return -1;
  if (a.date < b.date) return 1;
  return 0;
};

const orderAsc = (a: TNote, b: TNote) => {
  if (a.date > b.date) return 1;
  if (a.date < b.date) return -1;
  return 0;
};

const pinnedFirst = (note: TNote) => {
  if (note.pinned) return -1;
  return 0;
};

export const sortFn = (
  a: TNote,
  b: TNote,
  selected: 'asc' | 'desc' | 'pinned',
) => {
  const fn = {
    desc: orderDesc,
    asc: orderAsc,
    pinned: pinnedFirst,
  };
  return fn[selected](a, b);
};
