import { useFormContext } from 'react-hook-form';

import type { FormData } from '@/app/(protected)/diari/diario-cognitivo-comportamentale/compilazione/layout';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

export default function Step3() {
  const { control } = useFormContext<FormData>();

  return (
    <div className="space-y-10 p-4">
      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <div className="bg-card grid grid-cols-2 gap-10 rounded-sm px-4 py-6">
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
                      className={`relative cursor-pointer rounded-lg border px-4 py-3 text-sm ${
                        field.value === option
                          ? 'bg-primary-100 border-primary text-primary'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <FormControl>
                        <>
                          <RadioGroupItem
                            value={option}
                            id={`company-${option}`}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          />
                          <FormLabel
                            htmlFor={`company-${option}`}
                            className="w-full cursor-pointer"
                          >
                            {option}
                          </FormLabel>
                        </>
                      </FormControl>
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
              <div className="bg-card grid grid-cols-2 gap-10 rounded-sm px-4 py-6">
                <FormLabel className="text-base font-normal text-gray-900">
                  Con chi eri?
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Scrivi qui il tuo testo"
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500"
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
