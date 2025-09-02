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
      UE: z.number(),
      CR: z.number(),
      EE: z.number(),
    })
    .optional(),
});
export type FormValues = z.infer<typeof formSchema>;

interface Props {
  question: (typeof QUESTIONS)[0];
  defaultValue?: FormValues['response'];
}

export const Item3 = (props: Props) => {
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
              'mb-4 rounded-md bg-slate-100 p-4',
              field.value && 'border-slate-200 bg-slate-100',
            )}
          >
            <FormItem className="w-full items-center space-y-0">
              <FormLabel>
                <div className="grid grid-cols-[auto,1fr] gap-2">
                  <span className="font-bold text-primary">{id}.</span>
                  <span className="text-space-gray pb-5 font-bold leading-5">
                    {text}
                  </span>
                </div>
                <div className="flex justify-between px-1">
                  <p className="text-space-gray w-min pb-2 text-center text-sm leading-5">
                    Nessuna restrizione
                  </p>
                  <p className="text-space-gray w-min pb-2 text-center text-sm leading-5">
                    Restrizione totale
                  </p>
                </div>
              </FormLabel>

              <FormControl>
                <RadioGroup
                  disabled={!!defaultValue}
                  orientation="horizontal"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="ml-auto mt-0 shrink-0 grid-cols-8"
                >
                  {Array.from(Array(8).keys()).map((i) => (
                    <FormItem
                      key={(i + 1).toString()}
                      className="text-primary-400 flex items-center justify-center"
                    >
                      <FormControl>
                        <RadioGroupItem
                          value={(i + 1).toString()}
                          className="margin-auto border-primary disabled:opacity-100"
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
