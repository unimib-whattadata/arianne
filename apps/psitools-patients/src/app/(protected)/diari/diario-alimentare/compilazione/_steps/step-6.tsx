import { useFormContext } from 'react-hook-form';

import type { FormData } from '@/app/(protected)/diari/diario-alimentare/compilazione/layout';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function Step6() {
  const { control } = useFormContext<FormData>();

  const mealOptions = ['Si', 'No'] as const;

  return (
    <div className="space-y-10 p-4">
      <FormField
        control={control}
        name="mealConsideration"
        render={({ field }) => (
          <FormItem>
            <div className="bg-card grid grid-cols-2 gap-10 rounded-sm px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Consideri questa consumazione un pasto?
              </FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4">
                  <RadioGroup
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    className="flex flex-col gap-4"
                  >
                    {mealOptions.map((label) => (
                      <FormItem
                        key={label}
                        className={`relative cursor-pointer rounded-lg border px-4 py-3 text-sm ${
                          field.value === label
                            ? 'bg-primary-100 border-primary text-primary'
                            : 'border-gray-300 text-gray-700'
                        }`}
                      >
                        <FormControl>
                          <>
                            <RadioGroupItem
                              value={label}
                              id={label}
                              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            />
                            <FormLabel
                              htmlFor={label}
                              className="w-full cursor-pointer"
                            >
                              {label}
                            </FormLabel>
                          </>
                        </FormControl>
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
