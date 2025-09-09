import { Search, X } from 'lucide-react';
import React from 'react';

import { cn } from '@/utils/cn';

import { Input } from './ui/input';

const SearchInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & {
    cleanFn: () => void;
    placeholder: string;
  }
>(({ className, cleanFn, ...props }, ref) => {
  return (
    <div className={cn('group relative flex w-min items-center', className)}>
      <Input
        className="peer w-10 border-primary transition-[color,width] focus-within:w-80 focus-within:pr-9 focus:w-80 focus:pr-9 active:w-80 group-hover:w-80 group-hover:pr-9 not-placeholder-shown:w-80 not-placeholder-shown:pr-9"
        ref={ref}
        {...props}
      />
      <Search className="absolute right-2.5 top-2 h-5 w-5 bg-background text-primary peer-not-placeholder-shown:hidden" />
      <X
        className="absolute right-2.5 top-2 h-5 w-5 cursor-pointer bg-background text-primary peer-placeholder-shown:hidden"
        onClick={() => cleanFn()}
      />
    </div>
  );
});
Input.displayName = 'SearchInput';

export { SearchInput };
