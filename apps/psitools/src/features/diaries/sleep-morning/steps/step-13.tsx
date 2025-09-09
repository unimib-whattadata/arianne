import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export default function Step13() {
  const { control } = useFormContext();
  return (
    <div className="space-y-4">
      {' '}
      <FormField
        control={control}
        name="awakening"
        render={({
          field,
        }: {
          field: { onChange: (value: string) => void; value: string };
        }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Durante la notte quanti risvegli hai avuto?
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
    </div>
  );
}
