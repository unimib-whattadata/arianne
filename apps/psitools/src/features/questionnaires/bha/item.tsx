'use client';

import { useFormContext } from 'react-hook-form';
import { z } from 'zod';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/utils/cn';

interface Props {
  question: string;
  index: number;
  defaultValue?: FormValues['response'];
}

export const formSchema = z.object({
  response: z.record(
    z.string(),
    z
      .string({
        required_error:
          'Attenzione! Devi selezionare una risposta per poter caricare la somministrazione',
      })
      .min(1, {
        message:
          'Attenzione! Devi selezionare una risposta per poter caricare la somministrazione',
      }),
  ),
});
export type FormValues = z.infer<typeof formSchema>;

export const Item = (props: Props) => {
  const { question, index, defaultValue } = props;

  const form = useFormContext<FormValues>();

  return (
    <FormField
      control={form.control}
      defaultValue={defaultValue?.[`item-${index}`] ?? ''}
      name={`response.item-${index}`}
      render={({ field }) => {
        return (
          <div
            className={cn(
              'mb-2 flex flex-col rounded-md border border-white bg-white p-4 transition-colors duration-300',
              field.value && 'border-slate-200 bg-gray-10',
            )}
          >
            <FormItem className="flex items-center justify-between space-y-0">
              <FormLabel>
                <div className="grid grid-cols-[auto,1fr] gap-2">
                  <span className="text-slate-500">{index}.</span>
                  <span className="text-space-gray">{`${question}`}</span>
                </div>
              </FormLabel>

              <FormControl>
                <RadioGroup
                  disabled={!!defaultValue}
                  orientation="horizontal"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="mt-0 flex shrink-0"
                >
                  <FormItem className="text-primary-400 flex w-10 items-center justify-center space-x-3">
                    <FormControl>
                      <RadioGroupItem
                        value="true"
                        className="border-primary disabled:opacity-100"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem className="text-primary-400 flex w-10 items-center justify-center space-x-3">
                    <FormControl>
                      <RadioGroupItem
                        value="false"
                        className="border-primary disabled:opacity-100"
                      />
                    </FormControl>
                  </FormItem>
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
