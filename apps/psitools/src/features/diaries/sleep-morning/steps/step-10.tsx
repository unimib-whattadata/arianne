import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { FormData } from '@/features/diaries/sleep-morning/schema';

export default function Step10() {
  const { control } = useFormContext<FormData>();

  const activityOptions = ['Si', 'No'] as const;

  return (
    <div className="space-y-4">
      {' '}
      <FormField
        control={control}
        name="wakeUpPlanned"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Avevi previsto di svegliarti ad un orario specifico stamattina?
              </FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4">
                  <RadioGroup
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    className="flex flex-col gap-4"
                  >
                    {activityOptions.map((label) => (
                      <FormItem
                        key={label}
                        className={`relative cursor-pointer rounded-lg border px-4 py-3 text-sm ${
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
                </div>
              </FormControl>
            </div>

            {field.value === 'Si' && (
              <FormField
                control={control}
                name="wakeUpTime"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
                      <FormLabel className="text-base font-normal text-gray-900">
                        A che ora avevi previsto di svegliarti?
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          value={field.value ? String(field.value) : ''}
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
