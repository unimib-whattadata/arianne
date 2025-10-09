'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';

export interface CardOptionType {
  value: string;
  title: string;
  text: string;
  icon: React.ReactNode;
  route: string;
  completed?: boolean;
}

interface CardOptionProps {
  option: CardOptionType;
  completed?: boolean;
}

export function CardOption({ option, completed }: CardOptionProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col rounded-lg border border-transparent p-4 text-left transition md:p-6',
        completed ? 'bg-[#FDE8DC]' : 'bg-secondary-light',
      )}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="flex flex-col md:gap-2">
          <div
            className={cn(
              'h-6 w-6',
              completed ? 'text-primary' : 'text-secondary',
            )}
          >
            {option.icon}
          </div>
          <h3 className="text-h3 font-semibold text-slate-900">
            {option.title}
          </h3>
          <p>{option.text}</p>
        </div>

        {completed ? (
          <div className="text-primary mt-2 flex items-center justify-center gap-2 font-semibold md:mt-0 md:justify-end">
            <Check className="h-5 w-5" />
            FATTO
          </div>
        ) : (
          <Button
            variant="secondary"
            className="mt-2 font-light text-white md:mt-0"
          >
            <Link href={option.route}>Completa ora</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
