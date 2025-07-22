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
      anxiety: z.number(),
      depression: z.number(),
    })
    .optional(),
});
export type FormValues = z.infer<typeof formSchema>;

interface Props {
  question: (typeof QUESTIONS)[0];
  defaultValue?: FormValues['response'];
}

export const Item = (props: Props) => {
  const { question, defaultValue } = props;

  const { id, text, options, reverse } = question;

  const form = useFormContext<FormValues>();

  return (
    <FormField
      control={form.control}
      name={`response.item-${id}`}
      defaultValue={defaultValue?.[`item-${id}`] ?? ''}
      render={({ field }) => {
        return (
          <FormItem className="mb-4 rounded-md bg-slate-100 p-4">
            <FormLabel className="font-bold">
              <span className="mr-2 text-primary">{id}.</span>
              {text}
            </FormLabel>
            <FormControl>
              <RadioGroup
                disabled={!!defaultValue}
                orientation="horizontal"
                onValueChange={(value) => {
                  const transformedValue = reverse
                    ? (options.length - 1 - parseInt(value, 10)).toString()
                    : value;
                  field.onChange(transformedValue);
                }}
                defaultValue={
                  field.value === ''
                    ? ''
                    : reverse
                      ? (
                          options.length -
                          1 -
                          parseInt(field.value, 10)
                        ).toString()
                      : field.value
                }
              >
                {options.map((option, index) => {
                  const isSelected =
                    field.value ===
                    (reverse
                      ? (options.length - 1 - index).toString()
                      : index.toString());
                  return (
                    <FormItem
                      key={index}
                      className={cn(
                        'border-white relative -z-0 flex items-center space-x-2 space-y-0 rounded-md border bg-white-900 transition-colors duration-300',
                        isSelected && 'border-slate-200 bg-slate-100',
                      )}
                    >
                      <FormControl className="absolute left-4 text-primary">
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
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage className="-mb-2 mt-2" />
          </FormItem>
        );
      }}
    />
  );
};
