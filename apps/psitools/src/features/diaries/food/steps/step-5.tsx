import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export default function Step4() {
  const { control } = useFormContext();
  return (
    <div className="space-y-4">
      {' '}
      <FormField
        control={control}
        name="typeConsumation"
        render={({
          field,
        }: {
          field: { onChange: (value: string) => void; value: string };
        }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Che cosa hai consumato?
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  onChange={(event) => field.onChange(event.target.value)}
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
