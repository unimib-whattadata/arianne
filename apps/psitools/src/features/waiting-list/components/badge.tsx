import type { ClassValue } from 'clsx';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

export type BadgeState = 'pending' | 'accepted' | 'rejected';

export function ListBadge({ state }: { state: BadgeState }) {
  let colors: ClassValue;
  let label: string;

  switch (state) {
    case 'pending':
      colors = 'bg-[hsl(48,92%,90%)] text-[hsl(48,92%,43%)]';
      label = 'In attesa';
      break;
    case 'accepted':
      colors = 'bg-[hsl(108,49%,90%)] text-[hsl(137,26%,51%)]';
      label = 'Accettato';
      break;
    case 'rejected':
      colors = 'bg-[hsl(13,78%,91%)] text-[hsl(13,77%,55%)]';
      label = 'Rifiutato';
      break;
    default:
      colors = 'bg-[hsl(0,0%,90%)] text-[hsl(0,0%,50%)]';
      label = state;
  }

  return <Badge className={cn('px-3 py-1', colors)}>{label}</Badge>;
}
