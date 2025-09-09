import type { ClassValue } from 'clsx';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import type { medicalRecordStateEnum } from '@arianne/db/schema';

export function StateBadge({
  state,
}: {
  state: (typeof medicalRecordStateEnum.enumValues)[number];
}) {
  let colors: ClassValue;
  let label: string;

  switch (state) {
    case 'incoming':
      colors = 'bg-[hsl(214,52%,87%)] text-[hsl(214,100%,34%)]';
      label = 'In arrivo';
      break;
    case 'ongoing':
      colors = 'bg-[hsl(134,27%,90%)] text-[hsl(137,26%,51%)]';
      label = 'In corso';
      break;
    case 'archived':
      colors = 'bg-[hsl(214,32%,91%)] text-[hsl(215,20%,65%)]';
      label = 'Archiviato';
      break;
    default:
      colors = 'bg-[hsl(0,0%,90%)] text-[hsl(0,0%,50%)]';
      label = state;
  }

  return <Badge className={cn('px-3 py-1', colors)}>{label}</Badge>;
}
