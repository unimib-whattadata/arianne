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
        className="peer border-primary w-10 transition-[color,width] not-placeholder-shown:w-80 not-placeholder-shown:pr-9 group-hover:w-80 group-hover:pr-9 focus-within:w-80 focus-within:pr-9 focus:w-80 focus:pr-9 active:w-80"
        ref={ref}
        {...props}
      />
      <Search className="bg-background text-primary absolute top-2 right-2.5 h-5 w-5 peer-not-placeholder-shown:hidden" />
      <X
        className="bg-background text-primary absolute top-2 right-2.5 h-5 w-5 cursor-pointer peer-placeholder-shown:hidden"
        onClick={() => cleanFn()}
      />
    </div>
  );
});
SearchInput.displayName = 'SearchInput';

export { SearchInput };
