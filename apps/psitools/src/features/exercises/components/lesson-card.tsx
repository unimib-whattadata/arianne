// components/LessonCard.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface LessonCardProps {
  id: string;
  title: string;
  lastView: string;
  isAssigned?: boolean;
  onToggleAssign?: () => void;
}

export const LessonCard = ({
  id,
  title,
  lastView,
  isAssigned = false,
  onToggleAssign,
}: LessonCardProps) => {
  const pathname = usePathname();

  return (
    <div className="mb-2 flex w-full justify-between rounded-md bg-white p-4">
      <div className="flex flex-col">
        <p className="font-h2 line-clamp-1 text-left text-base break-all">
          {title}
        </p>

        <p className="mt-1 text-sm">
          Ultima visualizzazione:
          <span className="text-primary pl-2">{lastView}</span>
        </p>
      </div>

      <div className="flex flex-row items-center gap-2">
        <Button
          variant={isAssigned ? 'destructive' : 'outline'}
          size="sm"
          className="w-fit"
          onClick={(e) => {
            e.stopPropagation();
            onToggleAssign?.();
          }}
        >
          {isAssigned ? 'Rimuovi assegnazione' : 'Assegna'}
        </Button>

        <Button variant="outline" size="sm" className="w-fit" asChild>
          <Link href={`${pathname}/${id}`}>
            <Eye className="h-4 w-4 text-current" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
