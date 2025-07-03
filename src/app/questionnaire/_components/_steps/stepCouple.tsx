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

const COUPLE_OPTIONS = [
  { value: 0, label: "Difficoltà di comunicazione con il partner" },
  { value: 1, label: "Conflitti frequenti o litigi irrisolti" },
  { value: 2, label: "Crisi di coppia o pensieri di separazione" },
  { value: 3, label: "Mancanza di intimità o desiderio sessuale" },
  { value: 4, label: "Infedeltà o perdita di fiducia" },
  { value: 5, label: "Differenze nei progetti di vita o lavori" },
  { value: 6, label: "Altro (specifica)" },

];


export const Couple = () => {
  const { control, watch, setValue } = useFormContext<FormValues>();

  const reasons = watch("couple.reasons") || [];
  const detailText = watch("couple.detailText") ?? "";

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
          name="couple.reasons"
          render={({ field }) => {
            const selectedValues: number[] = Array.isArray(field.value)
              ? field.value
              : [];

            return (
              <FormItem>
                <FormLabel className="text-2xl font-semibold">
Parliamo di voi. Cosa ti porta qui?                </FormLabel>
                <FormDescription className="text-lg">
                  Puoi selezionare più di un’opzione tra quelle proposte
                </FormDescription>
                <FormControl>
                  <div>
                    <div className="mt-10 flex flex-col gap-4">
                      {COUPLE_OPTIONS.map((option) => {
                        const checked = selectedValues.includes(option.value);
                        return (
                          <label
                            key={option.value}
                            className="flex cursor-pointer items-center gap-4 rounded-lg border border-transparent bg-[#DFEBEF] px-6 py-4 text-lg transition hover:bg-[#cae3e9]"
                          >
                            <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#006279]">
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
                                const newValues = toggleReason(
                                  option.value,
                                  selectedValues,
                                );
                                field.onChange(newValues);

                                // Se deseleziono "Altro", cancello detailText
                                if (option.value === 6 && checked) {
                                  setValue("couple.detailText", "");
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
                            setValue("couple.detailText", e.target.value)
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
