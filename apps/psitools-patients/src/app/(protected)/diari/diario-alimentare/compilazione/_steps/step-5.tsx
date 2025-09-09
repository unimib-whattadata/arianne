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
    <FormField
      control={control}
      name="typeConsumation"
      render={({
        field,
      }: {
        field: { onChange: (value: string) => void; value: string };
      }) => (
        <FormItem className="mx-auto max-w-prose">
          <FormLabel className="font-bold">Che cosa hai consumato?</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Scrivi qui il tuo testo"
              onChange={(e) => field.onChange(e.target.value)}
              value={field.value || ''}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
