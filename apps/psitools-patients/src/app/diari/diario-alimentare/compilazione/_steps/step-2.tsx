import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import type { FormData } from '@/app/diari/diario-alimentare/compilazione/layout';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

export default function Step2() {
  const { control } = useFormContext<FormData>();
  const [placeSelected, setPlaceSelected] = useState<
    'In Casa' | 'Fuori Casa' | null
  >(null);

  const places = ['In Casa', 'Fuori Casa'] as const;

  return (
    <div className="space-y-10 p-4">
      <FormField
        control={control}
        name="placeConsumption"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-card px-4 py-6">
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

      {placeSelected !== null && (
        <FormField
          control={control}
          name="place"
          render={({ field }) => (
            <FormItem className="mx-auto mt-8 max-w-prose">
              <FormLabel className="font-bold">
                {placeSelected === 'In Casa'
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
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
