import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function Step14() {
  const { control } = useFormContext();
  return (
    <div className="space-y-4">
      {' '}
      <FormField
        control={control}
        name="nightawake"
        render={({
          field,
        }: {
          field: { onChange: (value: string) => void; value: string };
        }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Nel corso della notte quanto in totale sei rimasto sveglio?{' '}
              </FormLabel>
              <FormControl>
                <Input
                  type="time"
                  value={field.value ? String(field.value) : ''}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
