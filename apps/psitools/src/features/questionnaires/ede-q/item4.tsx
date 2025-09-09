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

interface Props {
  question: {
    index: number;
    text: string;
  };
  defaultValue?: FormValues['response'];
}

export const Item4 = (props: Props) => {
  const { question, defaultValue } = props;

  const { index, text } = question;

  const form = useFormContext<FormValues>();

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
            <FormItem className="flex w-full items-center space-y-0">
              <FormLabel>
                <div className="grid grid-cols-[auto_1fr] gap-2">
                  <span className="text-slate-500">{index}.</span>
                  <span className="text-space-gray">{text}</span>
                </div>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  disabled={!!defaultValue}
                  orientation="horizontal"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="ml-auto mt-0 shrink-0 grid-cols-7"
                >
                  {Array.from(Array(7).keys()).map((i) => (
                    <FormItem
                      key={i.toString()}
                      className="text-primary-400 flex w-10 items-center justify-center space-x-3"
                    >
                      <FormControl>
                        <RadioGroupItem
                          value={i.toString()}
                          className="border-primary disabled:opacity-100"
                        />
                      </FormControl>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
            <FormMessage className="-mb-2 mt-2" />
          </div>
        );
      }}
    />
  );
};
