"use client";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Plus, Users, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import { Switch } from "~/components/ui/switch";

interface HoursFormData {}

export default function Personal() {
  const form = useForm<HoursFormData>({
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<HoursFormData> = (data) => {
    console.log("Form data:", data);
  };

  // Array dei giorni della settimana
  const daysOfWeek = [
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
    "Domenica",
  ];

  // Array delle ore disponibili (08:00 - 20:00)
  const hours = Array.from({ length: 13 }, (_, i) => {
    const hour = 8 + i;
    return hour.toString().padStart(2, "0") + ":00";
  });

  return (
    <main className="min-h-safe px-6 py-36 sm:px-8 lg:px-12 lg:py-36">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mx-auto flex max-w-3xl flex-col items-start">
            <Users className="text-primary mb-4 h-10 w-10 sm:h-12 sm:w-12" />
            <h1 className="mb-4 text-2xl font-medium text-slate-900 sm:text-3xl lg:text-4xl">
              Disponibilità
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-slate-700 sm:mb-8 sm:text-base">
              Imposta le tua disponibilità: questo ci permetterà di inserirti
              nel sistema di abbinamento con i pazienti.
            </p>

            <div className="flex w-full flex-col gap-4">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="flex flex-col rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Switch + Giorno - Prima riga su mobile */}
                  <div className="mb-3 flex w-full items-center gap-2 sm:mb-0 sm:w-40">
                    <Switch />
                    <span className="font-medium">{day}</span>
                  </div>

                  {/* Orari - Seconda riga su mobile, centrati su desktop */}
                  <div className="mb-3 flex flex-1 flex-col items-start gap-2 sm:mb-0 sm:flex-row sm:items-center sm:justify-center">
                    <div className="w-full sm:w-32">
                      <Select>
                        <SelectTrigger className="bg-secondary-light w-full">
                          <SelectValue placeholder="Da" />
                        </SelectTrigger>
                        <SelectContent>
                          {hours.map((h) => (
                            <SelectItem key={h} value={h}>
                              {h}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <span className="w-6 self-center text-center font-medium text-slate-500 sm:self-auto">
                      -
                    </span>

                    <div className="w-full sm:w-32">
                      <Select>
                        <SelectTrigger className="bg-secondary-light w-full">
                          <SelectValue placeholder="A" />
                        </SelectTrigger>
                        <SelectContent>
                          {hours.map((h) => (
                            <SelectItem key={h} value={h}>
                              {h}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Azioni - Terza riga su mobile, allineata a destra su desktop */}
                  <div className="flex w-full items-center justify-end gap-3 sm:w-20">
                    <Plus className="text-secondary h-5 w-5 cursor-pointer" />
                    <Trash className="h-5 w-5 cursor-pointer text-red-500" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottoni di navigazione */}
            <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
              <Button className="w-full sm:flex-1" variant="outline">
                <Link
                  href="/terapeuti/onboarding/landing"
                  className="w-full text-center"
                >
                  Torna alla lista degli step
                </Link>
              </Button>
              <Button
                className="w-full sm:flex-1"
                variant="secondary"
                type="submit"
              >
                <Link
                  href="/terapeuti/onboarding/fiscal"
                  className="w-full text-center"
                >
                  Passa al prossimo step
                </Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
}
