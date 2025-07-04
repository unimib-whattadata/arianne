"use client";

import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import type { FormValues } from "~/app/questionnaire/_schema/therapy-form-schema";

const AGE_RANGES = [
  { value: 0, label: "Meno di 18 anni" },
  { value: 1, label: "Tra 18 e 25 anni" },
  { value: 2, label: "Tra 26 e 39 anni" },
  { value: 3, label: "Tra 40 e 50 anni" },
  { value: 4, label: "Oltre 50 anni" },
];

export const Step3 = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <div className="flex w-full flex-col items-center gap-6 p-6 md:p-10">
      <div className="w-full space-y-4">
        <FormField
          control={control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold">
                Quanti anni hai?
              </FormLabel>
              <FormDescription className="text-lg">
                Se sei minorenne, per legge, è necessario il consenso di
                entrambi i genitori o del tutore legale
              </FormDescription>
              <FormControl>
                <div className="mt-10 flex flex-col gap-4">
                  {AGE_RANGES.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-4 rounded-lg border border-transparent bg-[#DFEBEF] px-6 py-4 text-lg transition hover:bg-[#cae3e9]"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#006279] text-[#006279]">
                        {field.value === option.value && (
                          <Check
                            className="text-secondary h-3 w-3"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <input
                        type="radio"
                        value={option.value}
                        checked={field.value === option.value}
                        onChange={() => field.onChange(option.value)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
