import type { $Enums } from '@prisma/client';
import type { ClassValue } from 'clsx';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

export function StateBadge({ state }: { state: $Enums.StateType }) {
  let colors: ClassValue;
  let label: string;

  switch (state) {
    case 'incoming':
      colors = 'bg-[hsl(214,_52%,_87%)] text-[hsl(214,_100%,_34%)]';
      label = 'In arrivo';
      break;
    case 'ongoing':
      colors = 'bg-[hsl(134,_27%,_90%)] text-[hsl(137,_26%,_51%)]';
      label = 'In corso';
      break;
    case 'archived':
      colors = 'bg-[hsl(214,_32%,_91%)] text-[hsl(215,_20%,_65%)]';
      label = 'Archiviato';
      break;
    default:
      colors = 'bg-[hsl(0,_0%,_90%)] text-[hsl(0,_0%,_50%)]';
      label = state;
  }

  return <Badge className={cn('px-3 py-1', colors)}>{label}</Badge>;
}
