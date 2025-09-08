"use client";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { MultiSelect } from "~/components/ui/multi-select";
import Link from "next/link";
import { Wallet } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";

interface FiscalFormData {
  situazioneFiscale: string;
  piva: string;
  regimeFiscale?: string;
  iban: string;
  PEC: string;
  SDI: string;
  tariffa: string;
  tariffaOraria?: string;
  giorniDisponibili: string[];
  fasceOrarie: string[];
  numeroPazienti: number;
}

export default function Fiscal() {
  const form = useForm<FiscalFormData>({
    defaultValues: {
      situazioneFiscale: "",
      piva: "",
      regimeFiscale: "",
      iban: "",
      PEC: "",
      SDI: "",
      tariffa: "",
      tariffaOraria: "",
      giorniDisponibili: [],
      fasceOrarie: [],
      numeroPazienti: 1,
    },
  });

  const onSubmit: SubmitHandler<FiscalFormData> = (data) => {
    console.log("Form data:", data);
  };

  const daysOfWeek = [
    { value: "lunedi", label: "Lunedi" },
    { value: "martedi", label: "Martedi" },
    { value: "mercoledi", label: "Mercoledi" },
    { value: "giovedi", label: "Giovedi" },
    { value: "venerdi", label: "Ven" },
    { value: "sabato", label: "Sabato" },
    { value: "domenica", label: "Domenica" },
  ];

  const toggleDay = (day: string, currentValues: string[]) => {
    if (currentValues.includes(day)) {
      return currentValues.filter((d) => d !== day);
    } else {
      return [...currentValues, day];
    }
  };

  const situazioneFiscale = form.watch("situazioneFiscale");

  return (
    <main className="min-h-safe px-6 py-36 sm:px-8 lg:px-12 lg:py-36">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mx-auto flex max-w-3xl flex-col items-start">
            <Wallet className="text-primary mb-4 h-10 w-10 sm:h-12 sm:w-12" />
            <h1 className="mb-4 text-2xl font-medium text-slate-900 sm:text-3xl lg:text-4xl">
              Dati fiscali e disponibilità
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-slate-700 sm:mb-8 sm:text-base">
              Fornisci i tuoi dati fiscali e imposta le tue disponibilità:
              questo ci permetterà di inserirti nel sistema di abbinamento con i
              pazienti.
            </p>

            <h3 className="mt-10 mb-4 text-lg font-bold text-slate-900 sm:text-xl">
              Dati Fiscali
            </h3>

            <FormField
              control={form.control}
              name="situazioneFiscale"
              rules={{ required: "Selezionare la situazione fiscale" }}
              render={({ field }) => (
                <FormItem className="mt-4 w-full">
                  <p className="text-slate-900 sm:text-base">
                    Situazione Fiscale
                  </p>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="mt-2 w-full">
                        <SelectValue placeholder="Seleziona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iva">Partita IVA</SelectItem>
                        <SelectItem value="acconto">
                          Ritenuta d&apos;acconto
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {situazioneFiscale === "iva" && (
              <FormField
                control={form.control}
                name="piva"
                rules={{ required: "La partita IVA è obbligatoria" }}
                render={({ field }) => (
                  <FormItem className="mt-4 w-full">
                    <p className="text-slate-900 sm:text-base">Partita IVA</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Inserisci la tua partita IVA"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {situazioneFiscale === "acconto" && (
              <FormField
                control={form.control}
                name="regimeFiscale"
                rules={{ required: "Il regime fiscale è obbligatorio" }}
                render={({ field }) => (
                  <FormItem className="mt-4 w-full">
                    <p className="text-slate-900 sm:text-base">
                      Ritenuta d&apos;acconto
                    </p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Dettagli ritenuta d'acconto"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <div className="mt-6 flex w-full flex-col gap-4 sm:flex-row">
              <FormField
                control={form.control}
                name="iban"
                rules={{ required: "L'IBAN è obbligatorio" }}
                render={({ field }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900 sm:text-base">IBAN</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="IBAN"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="PEC"
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Indirizzo email non valido",
                  },
                }}
                render={({ field }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900 sm:text-base">PEC</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="miamail@pec.it"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="SDI"
                rules={{ required: "Il codice SDI è obbligatorio" }}
                render={({ field }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900 sm:text-base">Codice SDI</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Codice SDI"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6 flex w-full flex-col gap-4 sm:flex-row">
              <FormField
                control={form.control}
                name="tariffa"
                rules={{ required: "La tariffa è obbligatoria" }}
                render={({ field }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900 sm:text-base">
                      Tariffa base per seduta
                    </p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Tariffa base per seduta"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tariffaOraria"
                render={({ field }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900 sm:text-base">
                      Fascia tariffaria (facoltativa)
                    </p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Fascia tariffaria"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <h3 className="mt-10 mb-4 text-lg font-bold text-slate-900 sm:text-xl">
              Disponibilità
            </h3>
            <p className="mt-2 text-slate-900 sm:text-base">
              Giorni Disponibili
            </p>
            <FormField
              control={form.control}
              name="giorniDisponibili"
              rules={{ required: "Selezionare almeno un giorno" }}
              render={({ field }) => (
                <FormItem className="mt-2 w-full">
                  <FormControl>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() =>
                            field.onChange(
                              toggleDay(day.value, field.value || []),
                            )
                          }
                          className={`flex-1 rounded-full border px-3 py-1 text-sm transition-colors duration-200 sm:text-base ${
                            (field.value || []).includes(day.value)
                              ? "bg-secondary border-secondary text-secondary-foreground"
                              : "bg-secondary-light border-secondary text-secondary hover:bg-secondary/10"
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="mt-6 flex w-full flex-col gap-4 sm:flex-row">
              <FormField
                control={form.control}
                name="fasceOrarie"
                rules={{ required: "Selezionare almeno una fascia oraria" }}
                render={({ field }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900 sm:text-base">
                      Fasce orarie disponibili
                    </p>
                    <FormControl>
                      <MultiSelect
                        options={[
                          { value: "mattina", label: "Mattina" },
                          { value: "pomeriggio", label: "Pomeriggio" },
                          { value: "sera", label: "Sera" },
                        ]}
                        onValueChange={field.onChange}
                        value={field.value}
                        placeholder="Seleziona fascia oraria"
                        variant="inverted"
                        maxCount={3}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numeroPazienti"
                render={({ field }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900 sm:text-base">
                      Numero massimo pazienti
                    </p>
                    <FormControl>
                      <Input
                        type="number"
                        className="mt-2 w-full"
                        placeholder="Numero massimo pazienti"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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
                  href="/terapeuti/onboarding/privacy"
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
