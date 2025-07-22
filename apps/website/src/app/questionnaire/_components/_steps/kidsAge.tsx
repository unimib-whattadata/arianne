"use client";

import { Check } from "lucide-react";
import {
  useFormContext,
  useFieldArray,
  useWatch,
} from "react-hook-form";

import { useEffect } from "react";

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

  const numberOfChildren = useWatch({
    control,
    name: "family.numberOfChildren",
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "family.children",
  });

 useEffect(() => {
    const count = typeof numberOfChildren === "number" ? numberOfChildren + 1 : 0;

    if (count > 0) {
      const current = fields.length;
      if (current < count) {
        for (let i = current; i < count; i++) {
          append({ age: 0, detail: [] });
        }
      } else if (current > count) {
        for (let i = current - 1; i >= count; i--) {
          remove(i);
        }
      }
    } else {
      replace([]);
    }
  }, [numberOfChildren, append, remove, replace, fields.length]);

  const toggleValue = (current: number[], value: number): number[] =>
    current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

  return (
    <div className="flex w-full flex-col items-center gap-6 p-6 md:p-10">
      <div className="w-full space-y-8">
        <FormLabel className="text-2xl font-semibold">
          Qual è l’età dei tuoi figli?
        </FormLabel>

        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`family.children.${index}.detail`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium">
                  Figlio/a {index + 1}
                </FormLabel>
                <FormControl>
                  <div className="mt-4 flex flex-col gap-4">
                    {AGE_RANGES.map((option) => {
                      const checked = field.value?.includes(option.value);

                      return (
                        <label
                          key={option.value}
                          className="flex cursor-pointer items-center gap-4 rounded-lg border border-transparent bg-[#DFEBEF] px-6 py-4 text-lg transition hover:bg-[#cae3e9]"
                        >
                          <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#006279] text-[#006279]">
                            {checked && (
                              <Check
                                className="h-3 w-3 text-white"
                                strokeWidth={3}
                              />
                            )}
                          </div>
                          <Input
                            type="checkbox"
                            value={option.value}
                            checked={checked}
                            onChange={() => {
                              const newValues = toggleValue(
                                field.value || [],
                                option.value,
                              );
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
        ))}
      </div>
    </div>
  );
};
