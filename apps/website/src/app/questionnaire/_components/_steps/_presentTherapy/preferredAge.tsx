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

const AGE = [
  { value: 0, label: "Minore di 40 anni" },
  { value: 1, label: "Maggiore di 40 anni" },
  { value: 2, label: "È indifferente" },
];

export const PreferredAge = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <div className="flex w-full flex-col items-center gap-6 p-6 md:p-10">
      <div className="w-full space-y-4">
        <FormField
          control={control}
          name="preferredAge"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold">
                Hai preferenze in merito all’età del terapeuta?{" "}
              </FormLabel>

              <FormControl>
                <div className="mt-10 flex flex-col gap-4">
                  {AGE.map((option) => (
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
              <p className="text-lg">
                Tutti i nostri professionisti hanno completato un lungo percorso
                formativo, e per questo hanno una preparazione solida e un’età
                minima che garantisce maturità e competenza
              </p>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
