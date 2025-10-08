import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { FormData } from '@/features/diaries/cognitive-behavioral/schema';

export default function Step10() {
  const { control } = useFormContext<FormData>();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="thought"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal">
                Cosa hai pensato quando è avvenuto tutto ciò che hai descritto?
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Scrivi qui il tuo testo" {...field} />
              </FormControl>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
