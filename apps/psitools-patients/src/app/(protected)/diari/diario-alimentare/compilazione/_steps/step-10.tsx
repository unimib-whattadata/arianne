import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export default function Step10() {
  const { control } = useFormContext();

  return (
    <div className="space-y-10 p-4">
      <FormField
        control={control}
        name="PostConsumerBehaviors"
        render={({ field }) => (
          <FormItem className="mx-auto max-w-prose">
            <FormLabel className="font-bold">
              Dopo questa consumazione, hai messo in atto particolari
              comportamenti?
            </FormLabel>
            <FormControl>
              <Textarea placeholder="Scrivi qui il tuo testo" {...field} />
            </FormControl>
            <p className="text-caption mt-4 text-grey-500">
              Ecco alcuni esempi di comportamenti post-consumo, ma se non trovi
              il tuo puoi scriverlo sopra.
            </p>
          </FormItem>
        )}
      />
    </div>
  );
}
