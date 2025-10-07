'use client';

import { Check } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import type { FormValues } from '@/app/(onboarding)/questionnaire/_schema/therapy-form-schema';
import { Input } from '@/components/ui/input';

const PAST_THERAPY = [
  { value: 0, label: 'Si, ho interrotto di recente un percorso ' },
  { value: 1, label: 'Si, ma molto tempo fa ' },
  { value: 2, label: 'Sono tutt’ora in terapia ' },
  { value: 3, label: 'No ' },
];

export const PastTherapy = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <div className="flex w-full flex-col items-center gap-6 p-6 md:p-10">
      <div className="w-full space-y-4">
        <FormField
          control={control}
          name="pastTherapy"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold">
                Hai mai intrapreso un percorso di terapia in passato?{' '}
              </FormLabel>

              <FormControl>
                <div className="mt-10 flex flex-col gap-4">
                  {PAST_THERAPY.map((option) => (
                    <label
                      key={option.value}
                      className="bg-secondary-light hover:bg-secondary-foreground flex cursor-pointer items-center gap-4 rounded-lg border border-transparent px-6 py-4 text-lg transition"
                    >
                      <div className="border-secondary text-secondary flex h-5 w-5 items-center justify-center rounded-full border-2">
                        {field.value === option.value && (
                          <Check
                            className="text-secondary h-3 w-3"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <Input
                        type="radio"
                        value={option.value}
                        checked={field.value === option.value}
                        onChange={() => field.onChange(option.value)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
