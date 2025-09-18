"use client";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Users } from "lucide-react";
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

interface PersonalFormData {
  nome: string;
  cognome: string;
  data: string;
  luogo: string;
  email: string;
  telefono: string;
  genere: string;
  codicefiscale: string;
  titoloStudio: string;
  specializzazione: string;
  numeroIscrizione: string;
  provincia: string;
  anno: string;
}

export default function Personal() {
  const form = useForm<PersonalFormData>({
    defaultValues: {
      nome: "",
      cognome: "",
      data: "",
      luogo: "",
      email: "",
      telefono: "",
      genere: "",
      codicefiscale: "",
      titoloStudio: "",
      numeroIscrizione: "",
      specializzazione: "",
      provincia: "",
      anno: "",
    },
  });

  const onSubmit: SubmitHandler<PersonalFormData> = (data) => {
    console.log("Form data:", data);
  };

  return (
    <main className="min-h-safe px-6 py-36 sm:px-8 lg:px-12 lg:py-36">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mx-auto flex max-w-3xl flex-col items-start">
            <Users className="text-primary mb-4 h-10 w-10 sm:h-12 sm:w-12" />
            <h1 className="mb-4 text-2xl font-medium text-slate-900 sm:text-3xl lg:text-4xl">
              Dati anagrafici e qualifiche professionali
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-slate-700 sm:mb-8 sm:text-base">
              Inizia inserendo i tuoi dati anagrafici e le informazioni che
              attestano la tua qualifica come psicoterapeuta abilitato.
            </p>

            <h3 className="mt-10 mb-4 text-lg font-bold text-slate-900 sm:text-xl">
              Dati anagrafici
            </h3>

            {/* Nome e Cognome */}
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:gap-4">
              <FormField
                control={form.control}
                name="nome"
                rules={{ required: "Il nome è obbligatorio" }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900">Nome</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Nome"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cognome"
                rules={{ required: "Il cognome è obbligatorio" }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900">Cognome</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Cognome"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Data e Luogo */}
            <div className="mt-4 flex w-full flex-col gap-4 sm:mt-6 sm:flex-row sm:gap-4">
              <FormField
                control={form.control}
                name="data"
                rules={{ required: "La data di nascita è obbligatoria" }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900">Data di nascita</p>
                    <FormControl>
                      <Input type="date" className="mt-2 w-full" {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="luogo"
                rules={{ required: "Il luogo di nascita è obbligatorio" }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900">Luogo di nascita</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Luogo di nascita"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Email e Telefono */}
            <div className="mt-4 flex w-full flex-col gap-4 sm:mt-6 sm:flex-row sm:gap-4">
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "L'email è obbligatoria",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Indirizzo email non valido",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900">Email</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        type="email"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                rules={{
                  required: "Il numero di telefono è obbligatorio",
                  pattern: {
                    value: /^[0-9]{6,15}$/,
                    message: "Inserisci un numero valido (solo cifre)",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900">Numero di telefono</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        type="tel"
                        placeholder="Numero di telefono"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Genere e Codice Fiscale */}
            <div className="mt-4 flex w-full flex-col gap-4 sm:mt-6 sm:flex-row sm:gap-4">
              <FormField
                control={form.control}
                name="genere"
                rules={{ required: "Selezionare il genere" }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900">Genere</p>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-secondary-light mt-2 w-full">
                          <SelectValue placeholder="Seleziona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="donna">Donna</SelectItem>
                          <SelectItem value="uomo">Uomo</SelectItem>
                          <SelectItem value="nonBinario">
                            Non binario
                          </SelectItem>
                          <SelectItem value="altro">
                            Preferisco non specificarlo
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="codicefiscale"
                rules={{ required: "Il codice fiscale è obbligatorio" }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900">Codice Fiscale</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Codice Fiscale"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Titolo di studio */}
            <h3 className="mt-10 mb-4 text-lg font-bold text-slate-900 sm:text-xl">
              Qualifiche professionali
            </h3>

            <FormField
              control={form.control}
              name="titoloStudio"
              rules={{ required: "Il titolo di studio è obbligatorio" }}
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <p className="text-slate-900">Titolo di studio</p>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-secondary-light mt-2 w-full">
                        <SelectValue placeholder="Seleziona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="magistraleNuovo">
                          Laurea magistrale in Psicologia - Nuovo Ordinamento
                        </SelectItem>
                        <SelectItem value="magistraleVecchio">
                          Laurea magistrale in Psicologia - Vecchio Ordinamento
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Specializzazione */}
            <FormField
              control={form.control}
              name="specializzazione"
              rules={{ required: "La specializzazione è obbligatoria" }}
              render={({ field, fieldState }) => (
                <FormItem className="mt-4 w-full">
                  <p className="text-slate-900">Scuola di Specializzazione</p>
                  <FormControl>
                    <Input
                      className="mt-2 w-full"
                      placeholder="Scuola di Specializzazione"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Numero iscrizione, provincia e anno */}
            <div className="mt-4 flex w-full flex-col gap-4 sm:mt-6 lg:flex-row lg:gap-4">
              <FormField
                control={form.control}
                name="numeroIscrizione"
                rules={{ required: "Il numero di iscrizione è obbligatorio" }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full lg:flex-2">
                    <p className="text-slate-900">
                      Numero di iscrizione all&apos;Albo
                    </p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Numero di iscrizione"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <div className="flex w-full flex-col gap-4 sm:flex-row sm:gap-4 lg:w-auto">
                <FormField
                  control={form.control}
                  name="provincia"
                  rules={{ required: "Selezionare la provincia" }}
                  render={({ field, fieldState }) => (
                    <FormItem className="w-full lg:min-w-[120px]">
                      <p className="text-slate-900">Provincia</p>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="bg-secondary-light mt-2 w-full">
                            <SelectValue placeholder="Seleziona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mi">MI</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {fieldState.error && (
                        <p className="mt-1 text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="anno"
                  rules={{ required: "L'anno è obbligatorio" }}
                  render={({ field, fieldState }) => (
                    <FormItem className="w-full lg:min-w-[100px]">
                      <p className="text-slate-900">Anno</p>
                      <FormControl>
                        <Input
                          className="mt-2 w-full"
                          placeholder="AAAA"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="mt-1 text-sm text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Bottoni */}
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
                Passa al prossimo step
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
}
