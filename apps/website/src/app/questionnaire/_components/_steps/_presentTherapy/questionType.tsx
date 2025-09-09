"use client";

import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import type { FormValues } from "~/app/questionnaire/_schema/therapy-form-schema";
import { Input } from "~/components/ui/input";

const TYPES = [
  { value: 0, label: "Strutturate, più precise" },
  { value: 1, label: "Spontanee, più aperte e libere" },
  { value: 2, label: "Un mix delle opzioni precedenti" },
  { value: 3, label: "Non ho nessuna preferenza" },
];

export const QuestionType = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <div className="flex w-full flex-col items-center gap-6 p-6 md:p-10">
      <div className="w-full space-y-4">
        <FormField
          control={control}
          name="questionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold">
                Come preferisci che siano poste le domande?{" "}
              </FormLabel>

              <FormControl>
                <div className="mt-10 flex flex-col gap-4">
                  {TYPES.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-4 rounded-lg border border-transparent bg-secondary-light px-6 py-4 text-lg transition hover:bg-secondary-foreground"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-secondary text-secondary">
                        {field.value === option.value && (
                          <Check
                            className="text-secondary h-3 w-3"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <Input
                        type="radio"
                        value={option.value}
                        checked={field.value === option.value}
                        onChange={() => field.onChange(option.value)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
