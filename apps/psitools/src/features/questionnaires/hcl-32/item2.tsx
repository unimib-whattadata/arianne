'use client';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils/cn';

import type { QUESTIONS } from './questions';
import type { FormValues } from './schema';

interface Props {
  question: (typeof QUESTIONS)[number];
  defaultValue?: string;
  defaultNote?: string;
}

export const Item2 = (props: Props) => {
  const { question, defaultValue } = props;
  const { index } = question;
  const form = useFormContext<FormValues>();

  return (
    <FormField
      control={form.control}
      name={`response.items.item-${index}`}
      render={({ field }) => {
        return (
          <div
            className={cn(
              'mb-2 flex flex-col rounded-md border border-white bg-white p-4 transition-colors duration-300',
              field.value && 'border-slate-200 bg-slate-100',
            )}
          >
            <div className="grid grid-cols-[1fr,auto,auto,auto] items-center rounded-md transition-colors duration-300">
              <FormLabel>
                <div className="grid grid-cols-[auto,1fr] gap-2">
                  <span className="text-primary font-bold">
                    {question.index}.
                  </span>
                  <span className="font-bold text-space-gray">{`${question.text}`}</span>
                </div>
              </FormLabel>
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    disabled={!!defaultValue}
                    {...field}
                    value={defaultValue || field.value || ''}
                    className={cn(
                      'h-10 rounded-md border border-white bg-input p-2 transition-colors duration-300',
                      field.value ? 'border-primary' : 'border-white',
                    )}
                    placeholder="Scrivi qui"
                  />
                </FormControl>
              </FormItem>
            </div>
          </div>
        );
      }}
    />
  );
};
