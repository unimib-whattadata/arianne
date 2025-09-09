'use client';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { FormData } from '@/features/diaries/food/schema';

export default function Step2() {
  const { control } = useFormContext<FormData>();
  const [, setPlaceSelected] = useState<'In Casa' | 'Fuori Casa' | null>(null);

  const places = ['In Casa', 'Fuori Casa'] as const;

  const watchPlaceSelected = useWatch({ control, name: 'placeConsumption' });

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="placeConsumption"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Hai effettuato la consumazione in casa o fuori casa?
              </FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4">
                  <RadioGroup
                    value={field.value ?? ''}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Impostare immediatamente il valore di placeSelected
                      setPlaceSelected(value as 'In Casa' | 'Fuori Casa');
                    }}
                    className="flex flex-col gap-4"
                  >
                    {places.map((label) => (
                      <FormItem
                        key={label}
                        className={`relative cursor-pointer rounded-lg border px-4 py-3 text-center text-sm ${
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

      <FormField
        control={control}
        name="place"
        render={({ field }) => (
          <FormItem className={watchPlaceSelected === '' ? 'hidden' : ''}>
            <div className="grid grid-cols-2 items-center gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                {watchPlaceSelected === 'In Casa'
                  ? 'Mi sapresti indicare la stanza?'
                  : 'Mi sapresti indicare il luogo?'}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Scrivi qui il tuo testo"
                />
              </FormControl>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
