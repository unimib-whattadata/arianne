import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { FormValues } from "~/app/questionnaire/_schema/therapy-form-schema";

export const OtherInfo = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-10">
      <div className="w-full space-y-4">
        <FormField
          control={control}
          name="otherInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold">
C’è qualcos’altro che ritieni importante farci sapere? 
             </FormLabel>
              <FormDescription className="text-lg">
Aiutaci a conoscerti meglio, scrivi qui sotto ciò che ritieni più importante   
            </FormDescription>
              <FormControl>
                <Input
                  placeholder="Scrivi qui"
                  {...field}
                  className="mt-10 w-full rounded-lg border-none bg-[#DFEBEF] px-6 py-8 !text-lg focus-visible:ring-0 focus-visible:outline-none active:border-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
