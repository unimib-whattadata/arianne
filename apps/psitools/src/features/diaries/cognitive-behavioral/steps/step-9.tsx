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

export default function Step9() {
  const { control } = useFormContext<FormData>();

  const bodyEmotionOptions = ['Si', 'No'] as const;

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="bodyEmotion"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Hai provato qualche sensazione corporea?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  className="flex flex-col gap-4"
                >
                  {bodyEmotionOptions.map((label) => (
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
                          id={`bodyEmotion-${label}`}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor={`bodyEmotion-${label}`}
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
      {control._formValues.bodyEmotion === 'Si' && (
        <FormField
          control={control}
          name="bodyFeeling"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-2 items-center gap-10 rounded-sm bg-white px-4 py-6">
                <FormLabel className="text-base font-normal text-gray-900">
                  Quale sensazione corporea hai provato?
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
    </div>
  );
}
