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

export default function Step3() {
  const { control } = useFormContext<FormData>();

  const companyOptions = ['Da solo', 'In compagnia'] as const;

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-1 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Hai consumato il pasto da solo o in compagnia?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                  className="flex gap-4"
                >
                  {companyOptions.map((label) => (
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
              </FormControl>
            </div>

            {field.value === 'In compagnia' && (
              <FormField
                control={control}
                name="companyPerson"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
                      <FormLabel className="text-base font-normal text-gray-900">
                        Se hai mangiato in compagnia, con chi eri?
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
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
