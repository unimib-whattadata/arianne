'use client';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/utils/cn';

import type { QUESTIONS } from './questions';
import type { FormValues } from './schema';

interface Props {
  question: (typeof QUESTIONS)[0];
  defaultValue?: FormValues['response'];
}

export const Item3 = (props: Props) => {
  const { question, defaultValue } = props;

  const { index, text, options } = question;

  const form = useFormContext<FormValues>();

  return (
    <FormField
      control={form.control}
      name={`response.items.item-${index}`}
      defaultValue={defaultValue?.items[`item-${index}`] ?? ''}
      render={({ field }) => {
        return (
          <FormItem className="mb-4 rounded-md bg-slate-100 p-4">
            <FormLabel className="font-bold">
              <span className="text-primary mr-2">{index}.</span>
              {text}
            </FormLabel>
            <FormControl>
              <RadioGroup
                disabled={!!defaultValue}
                orientation="horizontal"
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                {options.map((option, index) => (
                  <FormItem
                    key={index}
                    className={cn(
                      'relative -z-0 flex items-center space-x-2 space-y-0 rounded-md border border-white bg-white transition-colors duration-300',
                      field.value === index.toString() &&
                        'border-slate-200 bg-slate-100',
                    )}
                  >
                    <FormControl className="text-primary absolute left-4">
                      <RadioGroupItem key={index} value={index.toString()} />
                    </FormControl>
                    <FormLabel
                      className={cn(
                        'w-full cursor-pointer p-4 pl-8 leading-5',
                        defaultValue && 'cursor-not-allowed',
                      )}
                    >
                      {option}
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage className="-mb-2 mt-2" />
          </FormItem>
        );
      }}
    />
  );
};
