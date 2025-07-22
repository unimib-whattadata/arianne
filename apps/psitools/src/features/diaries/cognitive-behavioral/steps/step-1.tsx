import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { FormData } from '@/features/diaries/cognitive-behavioral/schema';

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
      {' '}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Pensa a una situazione in cui hai provato una sensazione
                spiacevole, quando è successo?
              </FormLabel>
              <FormControl>
                <Textarea
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Scrivi qui il tuo testo"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500"
                />
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
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Ti ricordi indicativamente il momento della giornata in cui è
                accaduto?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value ?? ''}
                  onValueChange={(value) => field.onChange(value)}
                  className="flex flex-col gap-4"
                >
                  {moments.map(({ label }) => (
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
