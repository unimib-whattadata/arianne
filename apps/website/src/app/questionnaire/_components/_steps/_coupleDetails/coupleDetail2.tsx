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

const DETAIL2_OPTIONS = [
  {
    value: 0,
    label: "Mi domando frequentemente se la relazione abbia ancora un futuro",
  },
  {
    value: 1,
    label:
      "Provo un senso di distacco emotivo o di freddezza verso il mio partner",
  },
  {
    value: 2,
    label:
      "La convivenza o la relazione quotidiana è diventata fonte di sofferenza",
  },
  {
    value: 3,
    label: "Immagino spesso come sarebbe la vita senza il mio partner",
  },
  {
    value: 4,
    label: "Non riesco più a vedere soluzioni comuni ai nostri problemi",
  },
];

export const CoupleDetail2 = () => {
  const { control } = useFormContext<FormValues>();

  const toggleReason = (value: number, current: number[]) => {
    return current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
  };

  return (
    <div className="flex w-full flex-col items-center gap-6 p-6 md:p-10">
      <div className="w-full space-y-4">
        <FormField
          control={control}
          name="couple.details.2"
          render={({ field }) => {
            const selectedValues: number[] = Array.isArray(field.value)
              ? field.value
              : [];

            return (
              <FormItem>
                <FormLabel className="text-2xl font-semibold">
                  Stai attraversando una crisi di coppia o hai pensato alla
                  separazione?
                </FormLabel>
                <FormDescription className="text-lg">
                  Indica le risposte che ti rappresentano di più, puoi
                  selezionare anche più di un’opzione{" "}
                </FormDescription>
                <FormControl>
                  <div className="mt-10 flex flex-col gap-4">
                    {DETAIL2_OPTIONS.map((option) => {
                      const checked = selectedValues.includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className="flex cursor-pointer items-center gap-4 rounded-lg border border-transparent bg-[#DFEBEF] px-6 py-4 text-lg transition hover:bg-[#cae3e9]"
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
                            onChange={() =>
                              field.onChange(
                                toggleReason(option.value, selectedValues),
                              )
                            }
                            className="sr-only"
                          />
                          {option.label}
                        </label>
                      );
                    })}
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
