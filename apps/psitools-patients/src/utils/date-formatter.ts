import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export const dateFormatting = (
  date: Date | undefined,
  formatter: string,
): string => {
  if (!date) return 'Dato non trovato';
  return format(date, formatter, {
    locale: it,
  });
};
