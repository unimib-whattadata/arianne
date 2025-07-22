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

export default function Step11() {
  const { control } = useFormContext<FormData>();

  const physicalActivityOptions = ['Si', 'No'] as const;

  return (
    <div className="space-y-10 p-4">
      <FormField
        control={control}
        name="physicalActivity"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-card px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Dopo la consumazione, hai fatto attività fisica?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value ?? ''}
                  onValueChange={(value) => field.onChange(value)}
                  className="flex flex-col gap-4"
                >
                  {physicalActivityOptions.map((label) => (
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
                            id={`physical-activity-${label}`}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          />
                          <FormLabel
                            htmlFor={`physical-activity-${label}`}
                            className="w-full cursor-pointer"
                          >
                            {label}
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

      {control._formValues.physicalActivity === 'Si' && (
        <>
          <FormField
            control={control}
            name="typeActivityPhysics"
            render={({ field }) => (
              <FormItem className="mx-auto mt-8 max-w-prose">
                <FormLabel className="font-bold">
                  Che attività fisica hai svolto?
                </FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Scrivi qui il tuo testo" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="durationPhysicalActivity"
            render={({ field }) => (
              <FormItem className="mx-auto mt-8 max-w-prose">
                <FormLabel className="font-bold">
                  Quanto è durata l’attività fisica?
                </FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Scrivi qui il tuo testo" />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}
