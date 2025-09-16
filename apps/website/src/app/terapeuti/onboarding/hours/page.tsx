"use client";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Plus, Users, Trash, Moon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import { useForm, useFieldArray } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Switch } from "~/components/ui/switch";
import { useRouter } from "next/navigation";

import { Toaster, toast } from "sonner";

interface Slot {
  from: string;
  to: string;
}

interface DayAvailability {
  enabled: boolean;
  slots: Slot[];
}

interface HoursFormData {
  availability: Record<string, DayAvailability>;
}

function DayAvailabilityRow({
  day,
  form,
  hours,
}: {
  day: string;
  form: UseFormReturn<HoursFormData>;
  hours: string[];
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `availability.${day}.slots`,
  });

  const dayEnabled = form.watch(`availability.${day}.enabled`);

  return (
    <div className="flex flex-col rounded-lg border p-4 sm:flex-row sm:items-center">
      <FormField
        control={form.control}
        name={`availability.${day}.enabled`}
        render={({ field }) => (
          <FormItem className="mb-3 flex w-full items-center gap-2 sm:mb-0 sm:w-40 sm:justify-start">
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <span className="font-medium">{day}</span>
          </FormItem>
        )}
      />

      <div className="flex flex-1 flex-col gap-3 sm:justify-center">
        {dayEnabled ? (
          fields.map((slot, index) => (
            <div
              key={slot.id}
              className="flex flex-col gap-2 sm:flex-row sm:items-center"
            >
              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                <FormField
                  control={form.control}
                  name={`availability.${day}.slots.${index}.from`}
                  render={({ field }) => (
                    <FormItem className="flex-1 sm:w-32">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
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
                      </FormControl>
                    </FormItem>
                  )}
                />

                <span className="w-full text-center font-medium text-slate-500 sm:w-6 sm:flex-none">
                  -
                </span>

                <FormField
                  control={form.control}
                  name={`availability.${day}.slots.${index}.to`}
                  render={({ field }) => (
                    <FormItem className="flex-1 sm:w-32">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
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
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-3 sm:mt-0 sm:w-20 sm:justify-end">
                <Plus
                  className="text-secondary h-5 w-5 cursor-pointer"
                  onClick={() => append({ from: "", to: "" })}
                />
                <Trash
                  className="h-5 w-5 cursor-pointer text-red-500"
                  onClick={() => remove(index)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center justify-center rounded-md bg-slate-100 py-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Moon className="h-3 w-3" />
                <span className="text-sm">Nessuna disponibilità</span>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:w-20 sm:justify-end">
              <Plus
                className="text-secondary h-5 w-5 cursor-pointer"
                onClick={() => append({ from: "", to: "" })}
              />
            </div>
          </div>
        )}

        {dayEnabled && fields.length === 0 && (
          <div className="flex items-center gap-2">
            <div className="flex-1"></div>
            <div className="flex items-center gap-3 sm:w-20 sm:justify-end">
              <Plus
                className="text-secondary h-5 w-5 cursor-pointer"
                onClick={() => append({ from: "", to: "" })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Personal() {
  const router = useRouter();

  const daysOfWeek = [
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
    "Domenica",
  ];

  const hours = Array.from({ length: 13 }, (_, i) => {
    const hour = 8 + i;
    return hour.toString().padStart(2, "0") + ":00";
  });

  const form = useForm<HoursFormData>({
    defaultValues: {
      availability: daysOfWeek.reduce(
        (acc, day) => ({
          ...acc,
          [day]: {
            enabled: false,
            slots: [{ from: "", to: "" }],
          },
        }),
        {} as Record<string, DayAvailability>,
      ),
    },
  });

  const onSubmit: SubmitHandler<HoursFormData> = (data) => {
    const hasValidAvailability = Object.entries(data.availability).some(
      ([_, day]) =>
        day.enabled &&
        day.slots &&
        day.slots.length > 0 &&
        day.slots.some((slot) => slot.from && slot.to),
    );

    if (!hasValidAvailability) {
      toast.error("Seleziona almeno una fascia oraria per almeno un giorno");
      return;
    }

    const invalidDays = Object.entries(data.availability).filter(
      ([_, day]) =>
        day.enabled &&
        (!day.slots ||
          day.slots.length === 0 ||
          day.slots.every((s) => !s.from || !s.to)),
    );

    if (invalidDays.length > 0) {
      toast.error(
        `Seleziona almeno una fascia oraria per: ${invalidDays
          .map(([day]) => day)
          .join(", ")}`,
      );
      return;
    }

    console.log("Form data:", data);
    // Naviga solo se la validazione passa
    router.push("/terapeuti/onboarding/fiscal");
  };

  return (
    <main className="min-h-safe px-6 py-36 sm:px-8 lg:px-12 lg:py-36">
      <Toaster position="top-right" />
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
                <DayAvailabilityRow
                  key={day}
                  day={day}
                  form={form}
                  hours={hours}
                />
              ))}
            </div>

            <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
              <Button asChild className="w-full sm:flex-1" variant="outline">
                <Link href="/terapeuti/onboarding/fiscal">
                  Torna alla lista degli step
                </Link>
              </Button>
              <Button
                className="w-full sm:flex-1"
                variant="secondary"
                type="submit"
              >
                Passa al prossimo step
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
}
