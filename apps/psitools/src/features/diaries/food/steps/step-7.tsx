import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { FormData } from '@/features/diaries/food/schema';

export default function Step7() {
  const { control } = useFormContext<FormData>();

  const excessiveQuantityOptions = ['Si', 'No', 'Forse'] as const;

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="excessiveQuantity"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-1 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Pensi di averne consumato in quantità eccessive?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  className="flex gap-4"
                >
                  {excessiveQuantityOptions.map((label) => (
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
          </FormItem>
        )}
      />
    </div>
  );
}
