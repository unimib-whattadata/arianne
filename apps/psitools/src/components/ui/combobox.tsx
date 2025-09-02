'use client';

import type { LucideIcon } from 'lucide-react';
import { Check, ChevronsUpDown, Filter } from 'lucide-react';
import * as React from 'react';

import type { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/cn';

export interface Options {
  value: string;
  label: string;
  icon?: LucideIcon;
}

interface ComboboxProps {
  options: Options[];
  emptyText: string;
  placeholder: string;
  label: string;
  value?: string;
  setValue: (value: string) => void;
  triggerClassName?: string;
  itemClassName?: string;
  containerClassName?: string;
  triggerText?: string;
  variant?: ButtonProps['variant'];
}

export const Combobox = (props: ComboboxProps) => {
  const {
    options,
    emptyText,
    placeholder,
    label,
    value,
    setValue,
    triggerClassName,
    itemClassName,
    containerClassName,
    triggerText,
  } = props;

  const [open, setOpen] = React.useState(false);
  const handleOnSelect = (currentValue: string) => {
    setValue(currentValue === value ? '' : currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex w-[260px] items-center justify-between rounded-md border border-primary bg-gray-10 p-2.5 text-gray-500 hover:bg-white focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
            triggerClassName,
          )}
        >
          {value ? (
            triggerText ? (
              triggerText
            ) : (
              <span className="text-space-gray">
                {options.find((option) => option.value === value)?.label}
              </span>
            )
          ) : (
            label
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[260px] p-0', containerClassName)}>
        <Command>
          <CommandInput placeholder={placeholder} className="text-space-gray" multiple />
          <CommandEmpty>{emptyText}.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                className={cn(
                  'font-default relative flex w-full cursor-pointer select-none items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-gray-500 outline-none transition-colors hover:bg-slate-200 focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
                  value === option.value && 'bg-primary-200 hover:bg-slate-200',
                  itemClassName,
                )}
                key={option.value}
                onSelect={handleOnSelect}
              >
                {option.label}
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === option.value ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export function ComboboxPopover(props: ComboboxProps) {
  const {
    options,
    emptyText,
    placeholder,
    label,
    value,
    setValue,
    triggerClassName,
    containerClassName,
    itemClassName,
    triggerText,
    variant = 'default',
  } = props;

  const [open, setOpen] = React.useState(false);

  const getSelectedOption = (value: string | undefined) => {
    return options.find((option) => option.value === value);
  };

  const selectedStatus = getSelectedOption(value);

  const handleOnSelect = (currentValue: string) => {
    setValue(currentValue === value ? '' : currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" className={triggerClassName} variant={variant}>
          {selectedStatus ? (
            triggerText ? (
              triggerText
            ) : (
              <>
                {selectedStatus.icon && (
                  <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
                )}
                {selectedStatus.label}
              </>
            )
          ) : (
            <>{label}</>
          )}
          <Filter
            className="h-4 w-4"
            fill={selectedStatus ? 'currentColor' : 'none'}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('p-0', containerClassName)}
        side="right"
        align="start"
      >
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyText}.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={handleOnSelect}
                  className={cn(
                    'font-default relative flex w-full cursor-pointer select-none items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-gray-500 outline-none transition-colors hover:bg-slate-200 focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
                    value === option.value &&
                      'bg-primary-200 hover:bg-slate-200',
                    itemClassName,
                  )}
                >
                  {option.icon && (
                    <option.icon
                      className={cn(
                        'mr-2 h-4 w-4',
                        option.value === selectedStatus?.value
                          ? 'opacity-100'
                          : 'opacity-40',
                      )}
                    />
                  )}
                  <span>{option.label}</span>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
