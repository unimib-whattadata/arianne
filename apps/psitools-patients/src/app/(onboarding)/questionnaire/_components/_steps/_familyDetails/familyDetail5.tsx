'use client';

import { Check } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import type { FormValues } from '@/app/(onboarding)/questionnaire/_schema/therapy-form-schema';
import { Input } from '@/components/ui/input';

const DETAIL5_OPTIONS = [
  { value: 0, label: 'Dalla mancanza di comunicazione aperta tra noi' },
  {
    value: 1,
    label: 'Da  aspettative non soddisfatte o da delusione reciproca',
  },
  {
    value: 2,
    label: 'Da differenze nei nostri bisogni emotivi o nelle priorità',
  },
  {
    value: 3,
    label: 'Eventi o esperienze passate che hanno creato una distanza',
  },
  { value: 4, label: 'Non ne ho idea' },
];
export const FamilyDetail5 = () => {
  const { control } = useFormContext<FormValues>();

  const toggleReason = (value: number, current: number[]) => {
    return current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
  };

  return (
    <div className="flex w-full flex-col items-center gap-6 p-6 md:p-10">
      <div className="w-full space-y-4">
        <FormField
          control={control}
          name="family.details.5"
          render={({ field }) => {
            const selectedValues: number[] = Array.isArray(field.value)
              ? field.value
              : [];

            return (
              <FormItem>
                <FormLabel className="text-2xl font-semibold">
                  Da dove credi derivi la sensazione di distacco?
                </FormLabel>
                <FormDescription className="text-lg">
                  Indica le risposte che ti rappresentano di più, puoi
                  selezionare anche più di un’opzione{' '}
                </FormDescription>
                <FormControl>
                  <div className="mt-10 flex flex-col gap-4">
                    {DETAIL5_OPTIONS.map((option) => {
                      const checked = selectedValues.includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className="bg-secondary-light hover:bg-secondary-foreground flex cursor-pointer items-center gap-4 rounded-lg border border-transparent px-6 py-4 text-lg transition"
                        >
                          <div className="border-secondary flex h-5 w-5 items-center justify-center rounded-sm border-2">
                            {checked && (
                              <Check
                                className="text-secondary h-3 w-3"
                                strokeWidth={3}
                              />
                            )}
                          </div>
                          <Input
                            type="checkbox"
                            value={option.value}
                            checked={checked}
                            onChange={() =>
                              field.onChange(
                                toggleReason(option.value, selectedValues),
                              )
                            }
                            className="sr-only"
                          />
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                </FormControl>
              </FormItem>
            );
          }}
        />
      </div>
    </div>
  );
};
