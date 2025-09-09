import type { RouterOutputs } from '@arianne/api';
import type { Day, Month, Week } from '@/features/calendario/types';

type Events = RouterOutputs['events']['getAll'];

export const daysOfWeek: {
  name: Day['name'];
  abbr: Day['abbr'];
  index: number;
}[] = [
  { name: 'lunedì', abbr: 'lun', index: 0 },
  { name: 'martedì', abbr: 'mar', index: 1 },
  { name: 'mercoledì', abbr: 'mer', index: 2 },
  { name: 'giovedì', abbr: 'gio', index: 3 },
  { name: 'venerdì', abbr: 'ven', index: 4 },
  { name: 'sabato', abbr: 'sab', index: 5 },
  { name: 'domenica', abbr: 'dom', index: 6 },
];

const monthOfYear: { name: Month['name']; index: number }[] = [
  { name: 'gennaio', index: 0 },
  { name: 'febbraio', index: 1 },
  { name: 'marzo', index: 2 },
  { name: 'aprile', index: 3 },
  { name: 'maggio', index: 4 },
  { name: 'giugno', index: 5 },
  { name: 'luglio', index: 6 },
  { name: 'agosto', index: 7 },
  { name: 'settembre', index: 8 },
  { name: 'ottobre', index: 9 },
  { name: 'novembre', index: 10 },
  { name: 'dicembre', index: 11 },
];

export const getISOWeeksInYear = (year: number): number => {
  const januaryFirst = new Date(year, 0, 1);
  const firstThursday = new Date(januaryFirst);

  firstThursday.setDate(
    januaryFirst.getDate() + ((4 - januaryFirst.getDay() + 7) % 7),
  );

  const december28 = new Date(year, 11, 28);
  return getISOWeekNumber(december28) === 1 ? 52 : 53;
};

export const getISOWeekNumber = (date: Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    )
  );
};

export const checkEvent = (events: Events, date: Date): Events => {
  return events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate()
    );
  });
};

export const getMonthIndexFromWeek = (
  year: number,
  weekNumber: number,
): number => {
  const jan1 = new Date(year, 0, 1);
  const firstThursday = new Date(jan1);
  firstThursday.setDate(jan1.getDate() + ((4 - jan1.getDay() + 7) % 7));

  const firstMonday = new Date(firstThursday);
  firstMonday.setDate(firstThursday.getDate() - 3);

  const targetMonday = new Date(firstMonday);
  targetMonday.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);

  const monthCount = new Map<number, number>();
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(targetMonday);
    currentDate.setDate(targetMonday.getDate() + i);
    const month = currentDate.getMonth();
    monthCount.set(month, (monthCount.get(month) || 0) + 1);
  }

  let majorityMonth = 0;
  let maxCount = 0;
  monthCount.forEach((count, month) => {
    if (count > maxCount) {
      maxCount = count;
      majorityMonth = month;
    }
  });

  return majorityMonth;
};

export const getCurrentDayObject = (events: Event[]): Day => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayIndex = (dayOfWeek + 6) % 7;
  const dayInfo = daysOfWeek[dayIndex];

  return {
    ...dayInfo,
    dayNumber: today.getDate(),
    dayIndex,
    date: new Date(today),
    appointments: checkEvent(events, today),
  };
};

export const getWeek = (
  weekNumber: number,
  monthNumber: number,
  year: number,
  events: Event[],
): Week => {
  const januaryFirst = new Date(year, 0, 1);
  const firstThursday = new Date(januaryFirst);

  firstThursday.setDate(
    januaryFirst.getDate() + ((4 - januaryFirst.getDay() + 7) % 7),
  );

  const firstMonday = new Date(firstThursday);
  firstMonday.setDate(firstThursday.getDate() - 3);

  const targetMonday = new Date(firstMonday);
  targetMonday.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);

  const days: Day[] = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(targetMonday);
    currentDate.setDate(targetMonday.getDate() + i);

    days.push({
      ...daysOfWeek[i],
      dayNumber: currentDate.getDate(),
      dayIndex: i,
      date: new Date(currentDate),
      appointments: checkEvent(events, currentDate),
    });
  }

  const monthName = monthOfYear[monthNumber - 1].name;

  return {
    days,
    weekNumber,
    monthNumber,
    monthName,
    year,
  };
};

export const getMonth = (
  events: Event[],
  monthNumber: number,
  year: number,
): Month => {
  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error('Month number must be between 1 and 12');
  }

  const lastDayOfMonth = new Date(year, monthNumber, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const days: Day[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, monthNumber - 1, day);
    const dayOfWeek = currentDate.getDay();

    const dayIndex = (dayOfWeek + 6) % 7;
    const dayInfo = daysOfWeek[dayIndex];

    days.push({
      ...dayInfo,
      dayNumber: day,
      dayIndex,
      date: new Date(currentDate),
      appointments: checkEvent(events, currentDate),
    });
  }

  const monthName = monthOfYear[monthNumber - 1].name;
  const monthSpan = days[0].dayIndex;

  return {
    name: monthName,
    monthSpan: monthSpan,
    days: days,
    monthNumber: monthNumber,
    year: year,
  };
};

export const getCurrentDay = (): number => {
  return new Date().getDate();
};

export const getCurrentMonth = (): number => {
  return new Date().getMonth() + 1;
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const isToday = (day: number, month: number, year: number): boolean => {
  return (
    day === getCurrentDay() &&
    month === getCurrentMonth() &&
    year === getCurrentYear()
  );
};
