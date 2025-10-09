'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface ExerciseCardProps {
  id: string;
  title: string;
  count: number;
  lastView: string;
  isAssigned?: boolean;
  isDisabled?: boolean;
  onToggleAssign?: () => void;
}

export const ExerciseCard = ({
  id,
  title,
  count,
  lastView,
  isAssigned = false,
  isDisabled = false,
  onToggleAssign,
}: ExerciseCardProps) => {
  const pathname = usePathname();

  return (
    <div
      key={id}
      className="flex w-full justify-between rounded-md bg-white p-4"
    >
      <div className="flex flex-row items-center space-y-0">
        <Badge
          className={`mr-4 flex h-8 w-8 justify-center ${
            count !== 0 ? 'bg-primary' : 'bg-primary-300'
          } text-white`}
        >
          <span className="font-normal">{count}</span>
        </Badge>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <p className="font-h2 line-clamp-1 pr-1 text-left text-base break-all">
              {title}
            </p>
          </div>

          <p className="text-sm">
            Ultima visualizzazione:
            <span className="text-primary pl-2">{lastView}</span>
          </p>
        </div>
      </div>

      <div className="mr-4 flex flex-row items-center gap-2">
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

        <Button size="sm" className="w-fit" disabled={isDisabled}>
          <Link
            href={isDisabled ? '#' : `${pathname}/${id}`}
            onClick={(e) => {
              if (isDisabled) e.preventDefault();
            }}
          >
            Visualizza
          </Link>
        </Button>
      </div>
    </div>
  );
};
