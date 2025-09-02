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
import { Input } from "~/components/ui/input";

const FAMILY_OPTIONS = [
  {
    value: 0,
    label: "Difficoltà a comunicare con altri membri della famiglia",
  },
  { value: 1, label: "Conflitti frequenti o discussioni che non si risolvono" },
  { value: 2, label: "Problemi con i figli o difficoltà educative" },
  {
    value: 3,
    label:
      "Eventi stressanti che hanno influenzato la famiglia (separazioni, lutti, cambiamenti)",
  },
  {
    value: 4,
    label: "Sensazione di distanza o freddezza tra i membri della famiglia",
  },
  {
    value: 5,
    label: "Voglia di migliorare l'armonia e la relazione familiare",
  },
  { value: 6, label: "Altro" },
];

export const Family = () => {
  const { control, watch, setValue } = useFormContext<FormValues>();

  const detailText = watch("family.detailText") ?? "";

  const toggleReason = (value: number, current: number[]) => {
    if (current.includes(value)) {
      return current.filter((v) => v !== value);
    } else {
      return [...current, value];
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6 p-6 md:p-10">
      <div className="w-full space-y-4">
        <FormField
          control={control}
          name="family.reasons"
          render={({ field }) => {
            const selectedValues: number[] = Array.isArray(field.value)
              ? field.value
              : [];

            return (
              <FormItem>
                <FormLabel className="text-2xl font-semibold">
                  Cosa ti ha spinto a cercare una terapia familiare?{" "}
                </FormLabel>
                <FormDescription className="text-lg">
                  Puoi selezionare più di un’opzione tra quelle proposte
                </FormDescription>
                <FormControl>
                  <div>
                    <div className="mt-10 flex flex-col gap-4">
                      {FAMILY_OPTIONS.map((option) => {
                        const checked = selectedValues.includes(option.value);
                        return (
                          <label
                            key={option.value}
                            className="flex cursor-pointer items-center gap-4 rounded-lg border border-transparent bg-secondary-light px-6 py-4 text-lg transition hover:bg-secondary-foreground"
                          >
                            <div className="border-secondary flex h-5 w-5 items-center justify-center rounded-sm border-2">
                              {checked && (
                                <Check
                                  className="text-secondary h-3 w-3"
                                  strokeWidth={3}
                                />
                              )}
                            </div>
                            <Input
                              type="checkbox"
                              value={option.value}
                              checked={checked}
                              onChange={() => {
                                const newValues = toggleReason(
                                  option.value,
                                  selectedValues,
                                );
                                field.onChange(newValues);

                                if (option.value === 6 && checked) {
                                  setValue("family.detailText", "");
                                }
                              }}
                              className="sr-only"
                            />
                            {option.label}
                          </label>
                        );
                      })}
                    </div>

                    {/* Textarea per "Altro" */}
                    {selectedValues.includes(6) && (
                      <div className="mt-6">
                        <FormLabel htmlFor="detailText" className="text-lg">
                          Specifica altro:
                        </FormLabel>
                        <textarea
                          id="detailText"
                          className="w-full rounded-md border border-gray-300 p-2"
                          rows={4}
                          value={detailText}
                          onChange={(e) =>
                            setValue("family.detailText", e.target.value)
                          }
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            );
          }}
        />
      </div>
    </div>
  );
};
