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

const DETAIL5_OPTIONS = [
  {
    value: 0,
    label: "Mi sento confuso sul mio posto nel mondo o sul mio futuro ",
  },
  {
    value: 1,
    label: "Provo un senso di vuoto o mancanza di significato nella mia vita ",
  },
  {
    value: 2,
    label:
      "Ho difficoltà a prendere decisioni importanti o a fare scelte coerenti",
  },
  {
    value: 3,
    label:
      "Mi capita di non riconoscermi più o di non sapere cosa voglio davvero",
  },
  {
    value: 4,
    label:
      "Sento il bisogno di rimettere in discussione molte cose della mia vita, ma non so da dove partire ",
  },
];

export const IndividualDetail5 = () => {
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
          name="individual.details.5"
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
                  <div className="mt-10 flex flex-col gap-4">
                    {DETAIL5_OPTIONS.map((option) => {
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
