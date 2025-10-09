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

export default function Step8() {
  const { control, watch } = useFormContext<FormData>();

  const relevanceConsumptionValue = watch('relevanceConsumption');

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="relevanceConsumption"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-1 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Prima di questa consumazione è successo qualcosa di rilevante?
                Ad esempio eventi, pensieri ed emozioni importanti che hanno, o
                non hanno, influenzato l'alimentazione
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4"
                >
                  {['Si', 'No'].map((answer) => (
                    <FormItem
                      key={answer}
                      className={`relative w-full cursor-pointer rounded-lg border px-4 py-3 text-center text-sm ${
                        field.value === answer
                          ? 'bg-primary-100 border-primary text-primary'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <FormControl>
                        <RadioGroupItem
                          value={answer}
                          id={answer}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor={answer}
                        className="w-full cursor-pointer"
                      >
                        {answer}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="bodilysensation"
        render={({ field }) => (
          <FormItem>
            {relevanceConsumptionValue === 'Si' && (
              <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
                <FormLabel className="text-base font-normal text-gray-900">
                  Sapresti indicarmi che cosa hai pensato o che emozioni hai
                  provato?
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Scrivi qui il tuo testo" {...field} />
                </FormControl>
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
