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

import type { QUESTIONS } from './questions';

interface Props {
  question: (typeof QUESTIONS)[0];
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
  score: z
    .object({
      affettivita: z.number(),
      distacco: z.number(),
      antagonismo: z.number(),
      disinibizione: z.number(),
      psicoticismo: z.number(),
    })
    .optional(),
});
export type FormValues = z.infer<typeof formSchema>;

export const Item = (props: Props) => {
  const { question, defaultValue } = props;
  const { id, text } = question;

  const form = useFormContext<FormValues>();

  return (
    <FormField
      control={form.control}
      name={`response.item-${id}`}
      defaultValue={defaultValue?.[`item-${id}`] ?? ''}
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
                <div className="grid grid-cols-[auto,1fr] gap-2">
                  <span className="text-slate-500">{id}.</span>
                  <span className="text-space-gray">{text}</span>
                </div>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  disabled={!!defaultValue}
                  orientation="horizontal"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="ml-auto mt-0 shrink-0 grid-cols-4"
                >
                  {Array.from(Array(4).keys()).map((i) => {
                    const value = i.toString();
                    return (
                      <FormItem
                        key={i.toString()}
                        className="text-primary-400 flex w-10 items-center justify-center space-x-3"
                      >
                        <FormControl>
                          <RadioGroupItem
                            value={value}
                            className="border-primary disabled:opacity-100"
                          />
                        </FormControl>
                      </FormItem>
                    );
                  })}
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
