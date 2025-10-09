import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import type { FormData } from '@/features/diaries/sleep-evening/schema';

export default function Step3() {
  const { control, setValue, formState } = useFormContext<FormData>();

  useEffect(() => {
    if (formState.dirtyFields.difficulty) return;
    setValue('difficulty', 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="difficulty"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-x-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="col-span-1 text-base font-normal">
                Indica quanta difficoltà hai avuto nello studio, nel lavoro o
                nello svolgimento delle faccende quotidiane, a causa dei tuoi
                problemi di sonno
              </FormLabel>
              <div className="flex justify-between">
                <span className="text-grey-500 dark:text-white-900 font-bold">
                  Poco
                </span>
                <span className="text-grey-500 dark:text-white-900 font-bold">
                  Molto
                </span>
              </div>

              <div className="relative col-start-2 mt-2">
                <FormControl>
                  <Slider
                    value={[field.value ?? 5]}
                    onValueChange={(value) => field.onChange(value[0])}
                    max={10}
                    min={1}
                    step={1}
                    defaultValue={[5]}
                    thumbClassName="grid place-content-center bg-primary text-white font-semibold h-7 w-7 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer"
                  >
                    {field.value}
                  </Slider>
                </FormControl>
              </div>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
