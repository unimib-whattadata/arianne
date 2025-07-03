"use client";

import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import type { FormValues } from "~/app/questionnaire/_schema/therapy-form-schema";
import { Input } from "~/components/ui/input";

const AGE_RANGES = [
  { value: 0, label: 'Molto positiva' },
  { value: 1, label: 'Positiva' },
  { value: 2, label: 'Neutra' },
  { value: 3, label: 'Negativa' },
];



export const TherapyExperience = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <div className="flex w-full flex-col items-center gap-6 p-6 md:p-10">
      <div className="w-full space-y-4">
        <FormField
          control={control}
          name="therapyExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold">
Com’è stata la tua esperienza pregressa?            </FormLabel>
              
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
                            className="h-3 w-3 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <Input
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
