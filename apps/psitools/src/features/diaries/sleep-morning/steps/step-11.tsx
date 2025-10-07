import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { FormData } from '@/features/diaries/sleep-morning/schema';

export default function Step11() {
  const { control } = useFormContext<FormData>();
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="finalNap"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-2 gap-10 rounded-sm bg-white px-4 py-6">
              <FormLabel className="text-base font-normal text-gray-900">
                Questa mattina quale è stato l'orario del tuo risveglio finale?
                Cioè l'orario da cui non hai più dormito
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
