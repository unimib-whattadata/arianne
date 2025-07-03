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

const DETAIL1_OPTIONS = [
  { value: 0, label: "Mi sento molto spesso giù di morale " },
  { value: 1, label: "Ho perso interesse o piacere in attività che prima trovavo piacevoli " },
  { value: 2, label: "Mi sento stanco/a o senza energie anche senza aver fatto sforzi" },
  { value: 3, label: "Ho pensieri negativi su me stesso/a o un senso di colpa ingiustificato " },
  { value: 4, label: "Ho cambiamenti nell’appetito o nel sonno (mangio/ dormo troppo o poco) " },
  { value: 5, label: "Mi è capitato di pensare che la vita non abbia senso o di avere pensieri legati alla morte" },
];


export const IndividualDetail1 = () => {
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
          name="individual.details.1"
          render={({ field }) => {
            const selectedValues: number[] = Array.isArray(field.value)
              ? field.value
              : [];

            return (
              <FormItem>
                <FormLabel className="text-2xl font-semibold">
Ti senti spesso giù o senza energie? 
                </FormLabel>
                <FormDescription className="text-lg">
Indica le risposte che ti rappresentano di più, puoi selezionare anche più di un’opzione                </FormDescription>
                <FormControl>
                  <div className="mt-10 flex flex-col gap-4">
                    {DETAIL1_OPTIONS.map((option) => {
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
                            onChange={() =>
                              field.onChange(
                                toggleReason(option.value, selectedValues)
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
