import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function Step7() {
  const { control } = useFormContext();
  return (
    <div className="space-y-4">
      {' '}
      <FormField
        control={control}
        name="bedtime"
        render={({
          field,
        }: {
          field: { onChange: (value: string) => void; value: string };
        }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Ieri sera a che ora sei andato a letto?
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
