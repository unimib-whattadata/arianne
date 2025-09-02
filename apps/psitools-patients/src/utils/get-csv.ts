import { format } from 'date-fns';

import type { available } from '@/features/questionnaires/settings';

interface Props {
  input: string[][];
  type: (typeof available)[number];
}

export function getCSV({ input, type }: Props): {
  url: string;
  download: string;
} {
  const csv = input.map((row) => row.join(';')).join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Create the download filename composed of the type and the current date and time
  const dateString = format(new Date(), 'yyyy-MM-dd');

  const download = `${type} (${dateString}).csv`;

  return { url, download };
}
