'use client';

import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';

export interface CardOptionType {
  value: string;
  title: string;
  icon: React.ReactNode;
  route: string;
}

interface CardOptionProps {
  option: CardOptionType;
  completed?: boolean;
}

export function CardOption({ option, completed }: CardOptionProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col rounded-lg border border-transparent p-6 text-left transition',
        completed ? 'bg-[#FDE8DC]' : 'bg-secondary-light',
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              'h-6 w-6',
              completed ? 'text-primary' : 'text-secondary',
            )}
          >
            {option.icon}
          </div>
          <h3 className="font-medium text-slate-900">{option.title}</h3>
        </div>

        {completed ? (
          <div className="text-primary mt-2 flex items-center justify-center gap-2 font-semibold md:mt-0 md:justify-end">
            <Check className="h-5 w-5" />
            FATTO
          </div>
        ) : (
          <Button
            variant="secondary"
            className="text-strong text-secondary-foreground mt-2 md:mt-0"
          >
            <Link href={option.route}>Completa ora</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
