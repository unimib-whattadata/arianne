import { useFormContext } from 'react-hook-form';

import type { FormData } from '@/app/(protected)/diari/diario-alimentare/compilazione/layout';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

export default function Step9() {
  const { control, watch } = useFormContext<FormData>();

  const influenceConsumptionOptions = ['Si', 'No', 'In parte'] as const;
  const selectedAnswer = watch('influenceConsumption');

  return (
    <div className="space-y-10 p-4">
      <FormField
        control={control}
        name="influenceConsumption"
        render={({ field }) => (
          <FormItem>
            <div className="bg-card grid grid-cols-2 gap-10 rounded-sm px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Pensi che ciò che hai indicato possa aver influenzato la
                consumazione?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value ?? ''}
                  onValueChange={(value) => field.onChange(value)}
                  className="flex flex-col gap-4"
                >
                  {influenceConsumptionOptions.map((label) => (
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
              </FormControl>
            </div>
          </FormItem>
        )}
      />

      {selectedAnswer === 'In parte' && (
        <FormField
          control={control}
          name="reasonInfluence"
          render={({
            field,
          }: {
            field: {
              value: string;
              onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
            };
          }) => (
            <FormItem className="mt-8">
              <FormLabel className="font-bold">
                Che cosa l’ha influenzata in particolare?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Scrivi qui il tuo testo"
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
