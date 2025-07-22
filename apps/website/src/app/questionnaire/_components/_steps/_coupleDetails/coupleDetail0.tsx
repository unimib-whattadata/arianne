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

const DETAIL0_OPTIONS = [
  {
    value: 0,
    label: "Mi sento spesso frainteso/a o non ascoltato/a dal mio partner",
  },
  {
    value: 1,
    label:
      "Evito di esprimere i miei pensieri o bisogni per paura di discussioni",
  },
  {
    value: 2,
    label:
      "Quando parlo, il mio partner tende a interrompermi o a minimizzare ciò che dico",
  },
  {
    value: 3,
    label: "Le conversazioni importanti sfociano spesso in litigi o silenzi ",
  },
  {
    value: 4,
    label:
      "Provo difficoltà a trovare il momento o il modo giusto per parlare di argomenti delicati",
  },
  { value: 5, label: " " },
];

export const CoupleDetail0 = () => {
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
          name="couple.details.0"
          render={({ field }) => {
            const selectedValues: number[] = Array.isArray(field.value)
              ? field.value
              : [];

            return (
              <FormItem>
                <FormLabel className="text-2xl font-semibold">
                  Ti capita di avere difficoltà a comunicare con il tuo partner?
                </FormLabel>
                <FormDescription className="text-lg">
                  Indica le risposte che ti rappresentano di più, puoi
                  selezionare anche più di un’opzione{" "}
                </FormDescription>
                <FormControl>
                  <div className="mt-10 flex flex-col gap-4">
                    {DETAIL0_OPTIONS.map((option) => {
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
