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

import type { FormValues } from './schema';

interface QuestionWithOptions {
  readonly index: number;
  readonly text: string;
  readonly options: readonly string[];
}

interface Props {
  question: QuestionWithOptions;
  defaultValue?: FormValues['response'];
}

export const Item3 = (props: Props) => {
  const { question, defaultValue } = props;

  const { index, text, options } = question;

  const form = useFormContext<FormValues>();

  const isLastItem = options.length === 4;

  return (
    <FormField
      control={form.control}
      name={`response.items.item-${index}`}
      defaultValue={defaultValue?.items[`item-${index}`] ?? ''}
      render={({ field }) => {
        return (
          <div
            className={cn(
              'mb-2 flex flex-col rounded-md border border-white bg-white p-4 transition-colors duration-300',
              field.value && 'border-slate-200 bg-gray-10',
            )}
          >
            <FormItem className="w-full space-y-4">
              <FormLabel className="mb-2 font-semibold">{text}</FormLabel>

              {/* Options */}
              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: 7 }, (_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'text-primary text-center text-sm font-medium',
                      isLastItem && ![0, 2, 4, 6].includes(idx) && 'opacity-0',
                    )}
                  >
                    {isLastItem
                      ? [0, 2, 4, 6].includes(idx) &&
                        options[Math.floor(idx / 2)]
                      : options[idx]}
                  </div>
                ))}
              </div>

              {/* RadioGroup */}
              <RadioGroup
                disabled={!!defaultValue}
                orientation="horizontal"
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-7 gap-4"
              >
                {Array.from({ length: 7 }, (_, i) => (
                  <FormItem
                    key={i}
                    className="text-primary-400 flex items-center justify-center space-x-3"
                  >
                    <FormControl>
                      <RadioGroupItem
                        value={i.toString()}
                        className="border-primary border disabled:opacity-100"
                      />
                    </FormControl>
                  </FormItem>
                ))}
              </RadioGroup>

              <FormMessage className="-mb-2 mt-2" />
            </FormItem>
          </div>
        );
      }}
    />
  );
};
