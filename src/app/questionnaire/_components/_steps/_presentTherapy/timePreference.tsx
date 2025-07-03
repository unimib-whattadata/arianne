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

const TIME = [
    { value: 0, label: "Mattina 8.30-13" },
    { value: 1, label: "Pomeriggio 14-18" },
    { value: 2, label: "Sera 18-20.30" },
    { value: 3, label: "Non ho preferenze" },
];





export const TimePreference = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <div className="flex w-full flex-col items-center gap-6 p-6 md:p-10">
      <div className="w-full space-y-4">
        <FormField
          control={control}
          name="timePreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold">
Quali fasce orarie preferisci per le sedute? 
      </FormLabel>
      <FormDescription className="text-lg">
        Puoi scegliere più fasce orarie. Ti informeremo sulla disponibilità del terapeuta tra quelle selezionate*  
        </FormDescription>
              
              <FormControl>
                <div className="mt-10 flex flex-col gap-4">
                  {TIME.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-4 rounded-lg border border-transparent bg-[#DFEBEF] px-6 py-4 text-lg transition hover:bg-[#cae3e9]"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#006279] text-[#006279]">
                        {field.value === option.value && (
                          <Check
                            className="h-3 w-3 text-white"
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
              <p className="text-lg">L’orario selezionato si riferisce sempre al tuo fuso orario <br />
*Alcuni specialisti potrebbero richiedere un costo aggiuntivo per le sedute serali (dopo le 20:30) o nei festivi</p>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
