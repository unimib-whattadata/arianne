import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export default function Step12() {
  const { control } = useFormContext();

  return (
    <div className="space-y-10 p-4">
      <FormField
        control={control}
        name="PostConsumerEmotions"
        render={({ field }) => (
          <FormItem className="mx-auto max-w-prose">
            <FormLabel className="font-bold">
              Che emozioni hai provato dopo la consumazione?
            </FormLabel>
            <FormControl>
              <Textarea placeholder="Scrivi qui il tuo testo" {...field} />
            </FormControl>
            <p className="text-caption mt-4 text-grey-500">
              Ecco alcuni esempi di emozioni post-consumo, ma se non trovi la
              tua puoi scriverla sopra.
            </p>
          </FormItem>
        )}
      />
    </div>
  );
}
