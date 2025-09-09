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

export default function Step8() {
  const { control } = useFormContext<FormData>();

  return (
    <div className="space-y-10 p-4">
      <FormField
        control={control}
        name="relevanceConsumption"
        render={({ field }) => (
          <FormItem>
            <div className="bg-card grid grid-cols-2 gap-10 rounded-sm px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Prima di questa consumazione è successo qualcosa di rilevante?
                Ad esempio eventi, pensieri ed emozioni importanti che hanno, o
                non hanno, influenzato l'alimentazione
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col gap-4"
                >
                  {['Si', 'No'].map((answer) => (
                    <FormItem
                      key={answer}
                      className={`relative cursor-pointer rounded-lg border px-4 py-3 text-sm ${
                        field.value === answer
                          ? 'bg-primary-100 border-primary text-primary'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <FormControl>
                        <>
                          <RadioGroupItem
                            value={answer}
                            id={answer}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          />
                          <FormLabel
                            htmlFor={answer}
                            className="w-full cursor-pointer"
                          >
                            {answer}
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

      <FormField
        control={control}
        name="relevanceConsumption"
        render={({ field }) => (
          <FormItem>
            {field.value === 'Si' && (
              <div className="bg-card grid grid-cols-2 gap-10 rounded-sm px-4 py-6">
                <FormLabel className="text-base font-normal text-gray-900">
                  Sapresti indicarmi che cosa hai pensato o che emozioni hai
                  provato?
                </FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Scrivi qui il tuo testo" />
                </FormControl>
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
