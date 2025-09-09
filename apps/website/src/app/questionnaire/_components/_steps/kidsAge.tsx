"use client";

import { Check } from "lucide-react";
import {
  useFormContext,
  
} from "react-hook-form";


import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import type { FormValues } from "~/app/questionnaire/_schema/therapy-form-schema";
import { Input } from "~/components/ui/input";

const AGE_RANGES = [
  { value: 0, label: "0-3 anni" },
  { value: 1, label: "4-6 anni" },
  { value: 2, label: "7-10 anni" },
  { value: 3, label: "11-14 anni" },
  { value: 4, label: "15-18 anni" },
  { value: 5, label: "Più di 18 anni" },
];

export const ChildrenAges = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <div className="flex w-full flex-col items-center gap-6 p-6 md:p-10">
      <div className="w-full space-y-8">
        <FormLabel className="text-2xl font-semibold">
          Qual è l’età dei tuoi figli?
        </FormLabel>

        <FormField
          control={control}
          name={`family.childrenAge`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="mt-4 flex flex-col gap-4">
                  {AGE_RANGES.map((option) => {
                    const checked = field.value?.includes(option.value);

                    return (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-4 rounded-lg border border-transparent bg-secondary-light px-6 py-4 text-lg transition hover:bg-secondary-foreground"
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-sm  border-2 border-secondary text-secondary">
                          {checked && (
                            <Check
                              className="h-3 w-3 text-secondary"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                        <Input
                          type="checkbox"
                          value={option.value}
                          checked={checked}
                          onChange={() => {
                            const newValues = checked
                              ? field.value.filter((v: number) => v !== option.value)
                              : [...(field.value || []), option.value];
                            field.onChange(newValues);
                          }}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
