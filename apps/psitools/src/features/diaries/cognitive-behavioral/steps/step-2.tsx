import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export default function Step2() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      {' '}
      <FormField
        control={control}
        name="place"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal">
                Ti ricordi dove ti trovavi quando è successa questa situazione
                spiacevole?
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
