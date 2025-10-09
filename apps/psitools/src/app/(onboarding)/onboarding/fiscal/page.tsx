'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Wallet } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

interface FiscalFormData {
  situazioneFiscale: string;
  piva: string;
  regimeFiscale?: string;
  iban: string;
  PEC: string;
  SDI: string;
  tariffa: string;
  tariffaOraria?: string;
  numeroPazienti: number;
}

export default function Fiscal() {
  const form = useForm<FiscalFormData>({
    defaultValues: {
      situazioneFiscale: '',
      piva: '',
      regimeFiscale: '',
      iban: '',
      PEC: '',
      SDI: '',
      tariffa: '',
      tariffaOraria: '',
      numeroPazienti: 1,
    },
  });

  const situazioneFiscale = form.watch('situazioneFiscale');

  const onSubmit: SubmitHandler<FiscalFormData> = (data) => {
    const errors: Record<string, string> = {};

    if (!data.situazioneFiscale)
      errors.situazioneFiscale = 'Selezionare la situazione fiscale';
    if (data.situazioneFiscale === 'iva' && !data.piva)
      errors.piva = 'La partita IVA è obbligatoria';
    if (data.situazioneFiscale === 'acconto' && !data.regimeFiscale)
      errors.regimeFiscale = 'Il regime fiscale è obbligatorio';
    if (!data.iban) errors.iban = "L'IBAN è obbligatorio";
    if (!data.PEC) errors.PEC = 'La PEC è obbligatoria';
    if (!data.SDI) errors.SDI = 'Il codice SDI è obbligatorio';
    if (!data.tariffa) errors.tariffa = 'La tariffa è obbligatoria';
    if (!data.numeroPazienti)
      errors.numeroPazienti = 'Il numero massimo di pazienti è obbligatorio';

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([key, msg]) => {
        form.setError(key as keyof FiscalFormData, { message: msg });
      });
      return;
    }

    console.log('Form valido:', data);
  };

  return (
    <main className="min-h-safe px-6 py-36 sm:px-8 lg:px-12 lg:py-36">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mx-auto flex max-w-3xl flex-col items-start">
            <Wallet className="text-primary mb-4 h-10 w-10 sm:h-12 sm:w-12" />
            <h1 className="mb-4 text-2xl font-medium text-slate-900 sm:text-3xl lg:text-4xl">
              Dati fiscali e numero pazienti
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-slate-700 sm:mb-8 sm:text-base">
              Fornisci i tuoi dati fiscali e imposta il numero massimo di
              pazienti gestibili.
            </p>

            {/* Situazione Fiscale */}
            <FormField
              control={form.control}
              name="situazioneFiscale"
              render={({ field, formState }) => (
                <FormItem className="mt-4 w-full">
                  <p className="text-slate-900 sm:text-base">
                    Situazione Fiscale
                  </p>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-secondary-light mt-2 w-full">
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
                  {formState.errors.situazioneFiscale && (
                    <p className="mt-1 text-sm text-red-500">
                      {formState.errors.situazioneFiscale.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Partita IVA / Ritenuta d'acconto */}
            {situazioneFiscale === 'iva' && (
              <FormField
                control={form.control}
                name="piva"
                render={({ field, formState }) => (
                  <FormItem className="mt-4 w-full">
                    <p className="text-slate-900 sm:text-base">Partita IVA</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Inserisci la tua partita IVA"
                        {...field}
                      />
                    </FormControl>
                    {formState.errors.piva && (
                      <p className="mt-1 text-sm text-red-500">
                        {formState.errors.piva.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            )}
            {situazioneFiscale === 'acconto' && (
              <FormField
                control={form.control}
                name="regimeFiscale"
                render={({ field, formState }) => (
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
                    {formState.errors.regimeFiscale && (
                      <p className="mt-1 text-sm text-red-500">
                        {formState.errors.regimeFiscale.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            )}

            {/* IBAN, PEC, SDI */}
            <div className="mt-6 flex w-full flex-col gap-4 sm:flex-row">
              <FormField
                control={form.control}
                name="iban"
                render={({ field, formState }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900 sm:text-base">IBAN</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="IBAN"
                        {...field}
                      />
                    </FormControl>
                    {formState.errors.iban && (
                      <p className="mt-1 text-sm text-red-500">
                        {formState.errors.iban.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="PEC"
                render={({ field, formState }) => (
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
                    {formState.errors.PEC && (
                      <p className="mt-1 text-sm text-red-500">
                        {formState.errors.PEC.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="SDI"
                render={({ field, formState }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900 sm:text-base">Codice SDI</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Codice SDI"
                        {...field}
                      />
                    </FormControl>
                    {formState.errors.SDI && (
                      <p className="mt-1 text-sm text-red-500">
                        {formState.errors.SDI.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Tariffa */}
            <div className="mt-6 flex w-full flex-col gap-4 sm:flex-row">
              <FormField
                control={form.control}
                name="tariffa"
                render={({ field, formState }) => (
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
                    {formState.errors.tariffa && (
                      <p className="mt-1 text-sm text-red-500">
                        {formState.errors.tariffa.message}
                      </p>
                    )}
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

            {/* Numero pazienti */}
            <FormField
              control={form.control}
              name="numeroPazienti"
              render={({ field, formState }) => (
                <FormItem className="mt-6 w-full sm:flex-1">
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
                  {formState.errors.numeroPazienti && (
                    <p className="mt-1 text-sm text-red-500">
                      {formState.errors.numeroPazienti.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
              <Button className="w-full sm:flex-1" variant="outline">
                <Link href="/onboarding/landing" className="w-full text-center">
                  Torna alla lista degli step
                </Link>
              </Button>
              <Button
                className="w-full sm:flex-1"
                variant="secondary"
                type="submit"
              >
                <span className="w-full text-center">
                  Passa al prossimo step
                </span>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
}
