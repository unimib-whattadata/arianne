import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface FormData {
  note: string;
  [key: string]: unknown;
}

export default function Step21() {
  const { control } = useFormContext<FormData>();

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4">
        {' '}
        <FormField
          control={control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
                <FormLabel className="text-base font-normal">
                  Se c'è qualcos'altro che vorresti aggiungere a riguardo
                  scrivilo qui:
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Scrivi qui il tuo testo" {...field} />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
