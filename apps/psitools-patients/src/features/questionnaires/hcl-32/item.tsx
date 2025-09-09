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
  question: string;
  index: number;
  defaultValue?: FormValues['response'];
}

export const Item = (props: Props) => {
  const { question, index, defaultValue } = props;

  const form = useFormContext<FormValues>();

  return (
    <FormField
      control={form.control}
      defaultValue={defaultValue?.items[`item-${index}`] ?? ''}
      name={`response.items.item-${index}`}
      render={({ field }) => {
        return (
          <div
            className={cn(
              'border-white mb-2 flex flex-col rounded-md border bg-white-900 p-4 transition-colors duration-300',
              field.value && 'border-slate-200 bg-card',
            )}
          >
            <FormItem className="flex items-center justify-between space-y-0">
              <FormLabel>
                <div className="grid grid-cols-[auto,1fr] gap-2">
                  <span className="font-bold text-primary">{index}.</span>
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
