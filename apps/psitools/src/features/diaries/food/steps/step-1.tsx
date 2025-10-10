'use client';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { FormData } from '@/features/diaries/food/schema';

export default function Step1() {
  const { control } = useFormContext<FormData>();

  const moments = [
    { label: 'Mattina' },
    { label: 'Pomeriggio' },
    { label: 'Sera' },
    { label: 'Notte' },
  ];

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="timeConsumation"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Pensa alla consumazione che vorresti inserire nel diario, quando
                l'hai effettuata?
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Scrivi qui il tuo testo" {...field} />
              </FormControl>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="momentDay"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-1 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Ti ricordi indicativamente il momento della giornata in cui è
                accaduto?
              </FormLabel>
              <FormControl>
                <RadioGroup className="flex gap-4" {...field}>
                  {moments.map(({ label }) => (
                    <FormItem
                      key={label}
                      className={`relative w-full cursor-pointer rounded-lg border px-4 py-3 text-center text-sm ${
                        field.value === label
                          ? 'bg-primary-100 border-primary text-primary'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <FormControl>
                        <RadioGroupItem
                          value={label}
                          id={`moment-${label}`}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor={`moment-${label}`}
                        className="w-full cursor-pointer"
                      >
                        {label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
