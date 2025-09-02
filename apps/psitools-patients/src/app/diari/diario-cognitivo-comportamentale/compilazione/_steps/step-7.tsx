import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export default function Step7() {
  const { control } = useFormContext();

  return (
    <div className="space-y-10 p-4">
      <FormField
        control={control}
        name="emotion"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-card px-4 py-6">
              <FormLabel className="text-base font-normal">
                Quando questo è avvenuto, che emozione hai provato?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Scrivi qui il tuo testo"
                  {...field}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-orange-500"
                />
              </FormControl>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
