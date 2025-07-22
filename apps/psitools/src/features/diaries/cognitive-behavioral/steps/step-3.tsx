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

export default function Step3() {
  const { control } = useFormContext<FormData>();

  return (
    <div className="space-y-4">
      {' '}
      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Eri in compagnia?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                  className="flex flex-col gap-4"
                >
                  {['Si', 'No'].map((option) => (
                    <FormItem
                      key={option}
                      className={`relative cursor-pointer rounded-lg border px-4 py-3 text-center text-sm ${
                        field.value === option
                          ? 'bg-primary-100 border-primary text-primary'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <FormControl>
                        <RadioGroupItem
                          value={option}
                          id={`company-${option}`}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor={`company-${option}`}
                        className="w-full cursor-pointer"
                      >
                        {option}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </FormItem>
        )}
      />
      {control._formValues.company === 'Si' && (
        <FormField
          control={control}
          name="companyPerson"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
                <FormLabel className="text-base font-normal text-gray-900">
                  Con chi eri?
                </FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Scrivi qui il tuo testo" />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
