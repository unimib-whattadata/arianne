import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { FormData } from '@/features/diaries/sleep-morning/schema';

export default function Step3() {
  const { control } = useFormContext<FormData>();

  const exerciseOptions = ['Si', 'No'] as const;

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="exercise"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Ieri hai fatto esercizio fisico?
              </FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4">
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-col gap-4"
                  >
                    {exerciseOptions.map((label) => (
                      <FormItem
                        key={label}
                        className={`relative cursor-pointer rounded-lg border px-4 py-3 text-sm ${
                          field.value === label
                            ? 'bg-primary-100 border-primary text-primary'
                            : 'border-gray-300 text-gray-700'
                        }`}
                      >
                        <FormControl>
                          <RadioGroupItem
                            value={label}
                            id={label}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor={label}
                          className="w-full cursor-pointer"
                        >
                          {label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </div>
              </FormControl>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
