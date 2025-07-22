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
  score: z.number().optional(),
});
export type FormValues = z.infer<typeof formSchema>;

interface Props {
  question: (typeof QUESTIONS)[0];
  defaultValue?: FormValues['response'];
}

export const Item = (props: Props) => {
  const { question, defaultValue } = props;

  const { id, text, options } = question;

  const form = useFormContext<FormValues>();

  const isLastItem = options.length === 9;

  return (
    <FormField
      control={form.control}
      name={`response.item-${id}`}
      defaultValue={defaultValue?.[`item-${id}`] ?? ''}
      render={({ field }) => {
        return (
          <div
            className={cn(
              'border-white mb-2 flex flex-col rounded-md border bg-white-900 p-4 transition-colors duration-300',
              field.value && 'border-slate-200 bg-card',
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
                      'text-center text-sm font-medium text-primary',
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
                        className="border border-primary disabled:opacity-100"
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
