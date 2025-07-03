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
  { value: 0, label: "Ho subito o commesso un tradimento e fatico a superarlo" },
  { value: 1, label: "Provo spesso sospetti o mancanza di fiducia verso il mio partner" },
  { value: 2, label: "Dopo un episodio di infedeltà, faccio fatica a fidarmi nuovamente" },
  { value: 3, label: "La trasparenza e la comunicazione sono diminuite nella relazione" },
  { value: 4, label: "Sento che la ferita della fiducia tradita condiziona ancora il nostro rapporto" },
];

export const CoupleDetail4 = () => {
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
          name="couple.details.4"
          render={({ field }) => {
            const selectedValues: number[] = Array.isArray(field.value)
              ? field.value
              : [];

            return (
              <FormItem>
                <FormLabel className="text-2xl font-semibold">
Hai vissuto un`&apos;`infedeltà o una perdita di fiducia nella relazione?
           </FormLabel>
                <FormDescription className="text-lg">
Indica le risposte che ti rappresentano di più, puoi selezionare anche più di un’opzione                    </FormDescription>
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
