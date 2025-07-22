'use client';

import { useFormContext, useWatch } from 'react-hook-form';
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
  defaultValue?: string;
  defaultScore?: string;
}

export const formSchema = z.object({
  response: z.record(
    z.string(),
    z.object({
      value: z
        .string({
          required_error:
            'Attenzione! Devi selezionare una risposta per poter caricare la somministrazione',
        })
        .min(1, {
          message:
            'Attenzione! Devi selezionare una risposta per poter caricare la somministrazione',
        }),
      score: z.string().optional(),
    }),
  ),
});
export type FormValues = z.infer<typeof formSchema>;

export const PQ16Item = (props: Props) => {
  const { question, index, defaultValue, defaultScore } = props;

  const form = useFormContext<FormValues>();

  const questionValue = useWatch({
    control: form.control,
    name: `response.item-${index}.value`,
  });

  return (
    <div className="mb-2 grid grid-cols-[1fr,auto]">
      <div className="mr-4 grid grid-cols-[1fr,auto] rounded-md border border-white bg-white p-4 transition-colors duration-300">
        <FormLabel>
          <div className="grid grid-cols-[auto,1fr] gap-2">
            <span className="text-slate-500">{index}.</span>
            <span className="text-space-gray">{`${question}`}</span>
          </div>
        </FormLabel>
        <FormField
          control={form.control}
          defaultValue={defaultValue ?? ''}
          name={`response.item-${index}.value`}
          render={({ field }) => {
            const handleOnChange = (value: string) => {
              field.onChange(value);
              form.setValue(`response.item-${index}.score`, '0', {
                shouldDirty: true,
              });
            };
            return (
              <FormItem className="flex items-center justify-end space-y-0">
                <FormControl>
                  <RadioGroup
                    disabled={!!defaultValue}
                    orientation="horizontal"
                    onValueChange={handleOnChange}
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
            );
          }}
        />
      </div>
      <div className="flex items-stretch">
        <FormField
          control={form.control}
          defaultValue={defaultScore ?? ''}
          name={`response.item-${index}.score`}
          render={({ field }) => {
            return (
              <FormItem className="flex items-stretch space-y-0">
                <FormControl>
                  <RadioGroup
                    disabled={!!defaultScore}
                    orientation="horizontal"
                    onValueChange={field.onChange}
                    defaultValue="0"
                    value={questionValue === 'false' ? '0' : field.value}
                    className={cn(
                      'mt-0 flex shrink-0 rounded-md border border-white bg-white p-4 transition-colors duration-300',
                      questionValue === 'false' &&
                        'cursor-not-allowed border-slate-200 bg-gray-10',
                    )}
                  >
                    {Array.from(Array(4).keys()).map((i) => {
                      return (
                        <FormItem
                          key={i.toString()}
                          className={cn(
                            'text-primary-400 flex w-10 items-center justify-center space-x-3',
                            questionValue === 'false' && 'pointer-events-none',
                          )}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={i.toString()}
                              className="border-primary disabled:opacity-100"
                            />
                          </FormControl>
                        </FormItem>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            );
          }}
        />
      </div>
      <FormMessage className="-mb-2 mt-2" />
    </div>
  );
};
