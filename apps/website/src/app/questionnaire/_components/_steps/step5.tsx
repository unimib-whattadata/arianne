"use client";

import { UserRound, UsersRound, X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { getDefaultFormValues } from "~/app/questionnaire/_lib/get-default-values";
import type { FormValues } from "~/app/questionnaire/_schema/therapy-form-schema";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const OPTIONS = [
  {
    value: "individual",
    title: "Terapia individuale",
    description: "Lavora su te stesso con un terapeuta ",
    icon: <UserRound className="h-6 w-6 text-primary" />,
    modalContent:
      "È il percorso giusto se senti il bisogno di lavorare su di te per ottenere un cambiamento...",
  },
  {
    value: "couple",
    title: "Terapia di coppia",
    description: "Lavorate sulla coppia con un terapeuta",
    icon: <UsersRound className="h-6 w-6 text-primary" />,
    modalContent:
      "È il percorso giusto se sentite il bisogno di ritrovare connessione...",
  },
  {
    value: "family",
    title: "Terapia familiare",
    description: "Lavora sulle dinamiche familiari con un terapeuta ",
    icon: <UsersRound className="h-6 w-6 text-primary" />,
    modalContent: "Dettagli sul percorso familiare...",
  },
];

export const Step5 = () => {
  const { control, reset, getValues } = useFormContext<FormValues>();
  const [openModal, setOpenModal] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-10">
      <FormField
        control={control}
        name="path"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-2xl font-semibold">
              Che tipo di percorso ti interessa?
            </FormLabel>
            <FormControl>
              <div className="mt-10 flex flex-col gap-3">
                {OPTIONS.map((option) => {
                  const isSelected = field.value === option.value;

                  return (
                    <div
                      key={option.value}
                      role="button"
                      onClick={() => {
                        const newPath = option.value as
                          | "individual"
                          | "couple"
                          | "family";
                        const currentValues = getValues();

                        reset({
                          ...getDefaultFormValues(newPath),
                          name: currentValues.name,
                          age: currentValues.age,
                          gender: currentValues.gender,
                        });
                      }}
                      className={cn(
                        "flex h-full flex-col justify-between rounded-lg border border-transparent p-6 text-left transition",
                        isSelected
                          ? "bg-[#FDE8DC]"
                          : "bg-secondary-light hover:bg-secondary-foreground",
                      )}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="text-secondary">{option.icon}</div>
                        <h3 className="text-xl font-semibold">
                          {option.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-muted-foreground text-lg">
                            {option.description}
                          </p>
                          <div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenModal(option.value);
                              }}
                              className="text-md text-secondary underline hover:opacity-80"
                            >
                              Scopri di più
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-20 shadow-xl">
            <Button
              onClick={() => setOpenModal(null)}
              variant="outline"
              className="absolute top-6 right-6 rounded-full border-secondary px-2 text-secondary transition-colors hover:bg-secondary hover:text-white"
            >
              <X />
            </Button>

            <h2 className="mb-4 text-xl font-semibold">
              {OPTIONS.find((o) => o.value === openModal)?.title}
            </h2>
            <p className="text-md text-gray-700">
              {OPTIONS.find((o) => o.value === openModal)?.modalContent}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
