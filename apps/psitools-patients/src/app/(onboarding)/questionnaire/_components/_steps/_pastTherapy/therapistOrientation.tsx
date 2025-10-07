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

const ORIENTATION = [
  { value: 0, label: 'Cognitivo comportamentale' },
  { value: 1, label: 'Integrato' },
  { value: 2, label: 'Psicodinamico' },
  { value: 3, label: 'Sistemico relazionale' },
  { value: 4, label: 'Non ne sono certo/a' },
];

export const TherapistOrientation = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <div className="flex w-full flex-col items-center gap-6 p-6 md:p-10">
      <div className="w-full space-y-4">
        <FormField
          control={control}
          name="therapistOrientation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold">
                Qual era l’orientamento del/la terapeuta con cui hai lavorato
                prima?{' '}
              </FormLabel>

              <FormControl>
                <div className="mt-10 flex flex-col gap-4">
                  {ORIENTATION.map((option) => (
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
