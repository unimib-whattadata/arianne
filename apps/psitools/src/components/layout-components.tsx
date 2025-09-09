import { Children } from 'react';
import type { ClassNameValue } from 'tailwind-merge';

import { cn } from '@/utils/cn';

export const Title = ({ children }: { children: React.ReactNode }) => (
  <h1 className="text-xl font-semibold">{children}</h1>
);

export const Actions = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: ClassNameValue;
}) => {
  const element = Children.only(children);
  <div className={cn('flex', className)}>{element}</div>;
};

export const Content = ({ children }: { children: React.ReactNode }) =>
  children;
