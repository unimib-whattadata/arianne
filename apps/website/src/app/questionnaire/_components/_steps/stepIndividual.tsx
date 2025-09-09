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

const INDIVIDUAL_OPTIONS = [
  { value: 0, label: "Ansia o stress" },
  { value: 1, label: "Umore basso o depressione" },
  { value: 2, label: "Difficoltà relazionali o di coppia" },
  { value: 3, label: "Problemi lavorativi o accademici/scolastici" },
  { value: 4, label: "Eventi traumatici o lutti" },
  { value: 5, label: "Crisi esistenziali o senso di smarrimento" },
  { value: 6, label: "Altro (specifica)" },
];

export const Individual = () => {
  const { control, watch, setValue } = useFormContext<FormValues>();

  const detailText = watch("individual.detailText") ?? "";

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
          name="individual.reasons"
          render={({ field }) => {
            const selectedValues: number[] = Array.isArray(field.value)
              ? field.value
              : [];

            return (
              <FormItem>
                <FormLabel className="text-2xl font-semibold">
                  Cosa ti ha spinto a cercare supporto terapeutico?
                </FormLabel>
                <FormDescription className="text-lg">
                  Puoi selezionare più di un’opzione tra quelle proposte
                </FormDescription>
                <FormControl>
                  <div>
                    <div className="mt-10 flex flex-col gap-4">
                      {INDIVIDUAL_OPTIONS.map((option) => {
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
                                  setValue("individual.detailText", "");
                                }
                              }}
                              className="sr-only"
                            />
                            {option.label}
                          </label>
                        );
                      })}
                    </div>

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
                            setValue("individual.detailText", e.target.value)
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
