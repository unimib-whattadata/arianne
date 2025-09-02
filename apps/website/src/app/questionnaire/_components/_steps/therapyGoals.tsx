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

const GOALS_MAP: Record<
  "individual" | "couple" | "family",
  { value: number; label: string }[]
> = {
  individual: [
    { value: 0, label: "Gestire meglio ansia e stress" },
    { value: 1, label: "Ritrovare motivazione ed energia" },
    { value: 2, label: "Migliorare le relazioni amicali o con il partner" },
    { value: 3, label: "Superare un evento difficile e doloroso" },
    { value: 4, label: "Imparare come prendere decisioni importanti" },
    { value: 5, label: "Conoscere meglio me stesso/a" },
    { value: 6, label: "Altro" },
  ],
  couple: [
    { value: 0, label: "Ritrovare complicità e vicinanza emotiva" },
    { value: 1, label: "Gestire meglio i conflitti e ridurre i litigi" },
    {
      value: 2,
      label: "Ricostruire la fiducia dopo una crisi o un tradimento",
    },
    { value: 3, label: "Riconnettersi a livello sessuale e affettivo" },
    { value: 4, label: "Chiarire se e come proseguire la relazione" },
    { value: 6, label: "Altro" },
  ],
  family: [
    {
      value: 0,
      label: "Migliorare la comunicazione e la comprensione reciproca",
    },
    { value: 1, label: "Gestire meglio conflitti e tensioni familiari" },
    {
      value: 2,
      label: "Rafforzare il legame emotivo tra i membri della famiglia",
    },
    {
      value: 3,
      label:
        "Affrontare e superare difficoltà specifiche (es. eventi traumatici, cambiamenti, ecc.)",
    },
    {
      value: 4,
      label:
        "Avere maggiore chiarezza in merito all’origine di distacco e conflitti",
    },
    { value: 6, label: "Altro" },
  ],
};

export const GoalsStep = () => {
  const { control, watch, setValue } = useFormContext<FormValues>();

  const other = watch("therapyGoals.other") ?? "";
  const path = watch("path");

  const toggleReason = (value: number, current: number[]) => {
    if (current.includes(value)) {
      return current.filter((v) => v !== value);
    } else {
      return [...current, value];
    }
  };

  const GOALS = GOALS_MAP[path] ?? [];

  return (
    <div className="flex w-full flex-col items-center gap-6 p-6 md:p-10">
      <div className="w-full space-y-4">
        <FormField
          control={control}
          name="therapyGoals"
          render={({ field }) => {
            const selectedValues: number[] = Array.isArray(field.value)
              ? field.value
              : [];

            return (
              <FormItem>
                <FormLabel className="text-2xl font-semibold">
                  Quali obiettivi speri di raggiungere con la terapia?
                </FormLabel>
                <FormDescription className="text-lg">
                  Seleziona, tra le alternative, quelli che ritieni più
                  importanti per te
                </FormDescription>
                <FormControl>
                  <div className="mt-10 flex flex-col gap-4">
                    {GOALS.map((option) => {
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
                                setValue("therapyGoals.other", "");
                              }
                            }}
                            className="sr-only"
                          />
                          {option.label}
                        </label>
                      );
                    })}

                    {selectedValues.includes(6) && (
                      <div className="mt-6">
                        <FormLabel htmlFor="other" className="text-lg">
                          Specifica altro:
                        </FormLabel>
                        <textarea
                          id="other"
                          className="w-full rounded-md border border-gray-300 p-2"
                          rows={4}
                          value={other}
                          onChange={(e) =>
                            setValue("therapyGoals.other", e.target.value)
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
