import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { FormValues } from '@/app/(onboarding)/questionnaire/_schema/therapy-form-schema';

export const Step2 = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <div className="flex w-full flex-col gap-6 p-0 md:p-10">
      <div className="w-full space-y-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold">
                Iniziamo dalle presentazioni. Come ti chiami?
              </FormLabel>
              <FormDescription className="text-lg">
                Puoi usare il nome di battesimo o quello con cui vuoi essere
                chiamato
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="Scrivi qui"
                  {...field}
                  className="bg-secondary-light mt-4 w-full rounded-lg border-none px-4 py-6 !text-lg focus-visible:ring-0 focus-visible:outline-none active:border-none disabled:cursor-not-allowed disabled:opacity-50 md:mt-10 md:px-6 md:py-8 md:text-sm"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
