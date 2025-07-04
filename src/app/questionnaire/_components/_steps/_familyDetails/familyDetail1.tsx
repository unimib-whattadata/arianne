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
  {
    value: 0,
    label: "I conflitti si ripetono spesso senza mai arrivare a una soluzione",
  },
  {
    value: 1,
    label:
      "Le discussioni spesso si trasformano in litigi intensi o in silenzi prolungati",
  },
  {
    value: 2,
    label:
      "Quando cerchiamo di risolvere un conflitto, sembra che la situazione peggiori",
  },
  {
    value: 3,
    label:
      "Tendo ad evitare la discussione per non far esplodere ulteriori conflitti",
  },
  {
    value: 4,
    label:
      "Non ci sono conflitti frequenti, ma quando accadono è difficile trovare una soluzione",
  },
];

export const FamilyDetail1 = () => {
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
          name="family.details.1"
          render={({ field }) => {
            const selectedValues: number[] = Array.isArray(field.value)
              ? field.value
              : [];

            return (
              <FormItem>
                <FormLabel className="text-2xl font-semibold">
                  Come avvengono i conflitti in famiglia?
                </FormLabel>
                <FormDescription className="text-lg">
                  Indica le risposte che ti rappresentano di più, puoi
                  selezionare anche più di un’opzione{" "}
                </FormDescription>
                <FormControl>
                  <div className="mt-10 flex flex-col gap-4">
                    {DETAIL1_OPTIONS.map((option) => {
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
