"use client";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { MultiSelect } from "~/components/ui/multi-select";
import Link from "next/link";
import { BookHeart } from "lucide-react";
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

interface ExperienceFormData {
  modalitaLavoro: string;
  esperienza: number;
  descrizione: string;
  orientamento: string;
  lingue: string;
  specializzazioneclinica: string;
  competenza: string;
  categorie: string[];
  fasceEta: string[];
  indirizzo: string;
  paese: string;
  provinciaIndirizzo: string;
}

export default function Experience() {
  const form = useForm<ExperienceFormData>({
    defaultValues: {
      modalitaLavoro: "",
      esperienza: 0,
      descrizione: "",
      orientamento: "",
      lingue: "",
      specializzazioneclinica: "",
      competenza: "",
      categorie: [],
      fasceEta: [],
      indirizzo: "",
      paese: "",
      provinciaIndirizzo: "",
    },
  });

  const onSubmit: SubmitHandler<ExperienceFormData> = (data) => {
    console.log("Form data:", data);
  };

  const modalitaLavoro = form.watch("modalitaLavoro");

  return (
    <main className="min-h-safe px-6 py-36 sm:px-8 lg:px-12 lg:py-36">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mx-auto flex max-w-3xl flex-col items-start">
            <BookHeart className="text-primary mb-4 h-10 w-10 sm:h-12 sm:w-12" />
            <h1 className="mb-4 text-2xl font-medium text-slate-900 sm:text-3xl lg:text-4xl">
              Esperienza clinica e approccio terapeutico
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-slate-700 sm:mb-8 sm:text-base">
              Parlaci della tua esperienza professionale, delle persone con cui
              lavori meglio e dell&apos;approccio terapeutico che utilizzi.
            </p>

            <FormField
              control={form.control}
              name="modalitaLavoro"
              rules={{ required: "Selezionare la modalità di lavoro" }}
              render={({ field }) => (
                <FormItem className="mt-4 w-full">
                  <p className="text-slate-900 sm:text-base">
                    Che modalità di lavoro utilizzi
                  </p>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="mt-2 w-full">
                        <SelectValue placeholder="Seleziona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Solo online</SelectItem>
                        <SelectItem value="presenza">Solo presenza</SelectItem>
                        <SelectItem value="entrambi">
                          Sia in presenza che online
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {(modalitaLavoro === "presenza" ||
              modalitaLavoro === "entrambi") && (
              <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row sm:gap-4">
                <FormField
                  control={form.control}
                  name="indirizzo"
                  rules={{ required: "L'indirizzo è obbligatorio" }}
                  render={({ field }) => (
                    <FormItem className="w-full sm:flex-2">
                      <p className="text-slate-900 sm:text-base">Indirizzo</p>
                      <FormControl>
                        <Input
                          className="mt-2 w-full"
                          placeholder="Indirizzo"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paese"
                  rules={{ required: "Il paese è obbligatorio" }}
                  render={({ field }) => (
                    <FormItem className="w-full sm:flex-1">
                      <p className="text-slate-900 sm:text-base">Paese</p>
                      <FormControl>
                        <Input
                          className="mt-2 w-full"
                          placeholder="Paese"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="provinciaIndirizzo"
                  rules={{ required: "La provincia è obbligatoria" }}
                  render={({ field }) => (
                    <FormItem className="w-full sm:flex-1">
                      <p className="text-slate-900 sm:text-base">Provincia</p>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="mt-2 w-full">
                            <SelectValue placeholder="Seleziona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MI">Milano</SelectItem>
                            <SelectItem value="RM">Roma</SelectItem>
                            <SelectItem value="NA">Napoli</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row sm:gap-4">
              <FormField
                control={form.control}
                name="esperienza"
                rules={{ required: "L'esperienza è obbligatoria" }}
                render={({ field }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900 sm:text-base">
                      Anni di esperienza
                    </p>
                    <FormControl>
                      <Input
                        type="number"
                        className="mt-2 w-full"
                        placeholder="Anni di esperienza"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lingue"
                rules={{ required: "Le lingue parlate sono obbligatorie" }}
                render={({ field }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900 sm:text-base">
                      Lingue parlate
                    </p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Lingue parlate"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descrizione"
              rules={{ required: "La descrizione è obbligatoria" }}
              render={({ field }) => (
                <FormItem className="mt-4 w-full">
                  <p className="text-slate-900 sm:text-base">
                    Breve descrizione e bio professionale (max 500 caratteri)
                  </p>
                  <FormControl>
                    <Textarea
                      className="mt-2 w-full"
                      placeholder="Descrizione"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row sm:gap-4">
              <FormField
                control={form.control}
                name="orientamento"
                rules={{
                  required: "L'orientamento terapeutico è obbligatorio",
                }}
                render={({ field }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900 sm:text-base">
                      Orientamento terapeutico
                    </p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Orientamento terapeutico"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specializzazioneclinica"
                rules={{
                  required: "La specializzazione clinica è obbligatoria",
                }}
                render={({ field }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900 sm:text-base">
                      Specializzazioni cliniche
                    </p>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="mt-2 w-full">
                          <SelectValue placeholder="Seleziona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="edmr">EDMR</SelectItem>
                          <SelectItem value="psr">PSR</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="competenza"
              rules={{ required: "La competenza è obbligatoria" }}
              render={({ field }) => (
                <FormItem className="mt-4 w-full">
                  <p className="text-slate-900 sm:text-base">
                    Aree di competenza
                  </p>
                  <FormControl>
                    <Input
                      className="mt-2 w-full"
                      placeholder="Aree di competenza"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row sm:gap-4">
              <FormField
                control={form.control}
                name="fasceEta"
                rules={{ required: "Selezionare almeno una fascia d'età" }}
                render={({ field }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900 sm:text-base">
                      Esperienza con fasce d&apos;età specifiche
                    </p>
                    <FormControl>
                      <MultiSelect
                        options={[
                          { value: "bambini", label: "Bambini" },
                          { value: "adolescenti", label: "Adolescenti" },
                          { value: "adulti", label: "Adulti" },
                          { value: "anziani", label: "Anziani" },
                        ]}
                        onValueChange={field.onChange}
                        value={field.value}
                        placeholder="Seleziona fascia d'età"
                        variant="inverted"
                        maxCount={3}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categorie"
                rules={{ required: "Selezionare almeno una categoria" }}
                render={({ field }) => (
                  <FormItem className="w-full sm:flex-1">
                    <p className="text-slate-900 sm:text-base">
                      Esperienza con categorie specifiche
                    </p>
                    <FormControl>
                      <MultiSelect
                        options={[
                          { value: "LGBTQIA+", label: "LGBTQIA+" },
                          {
                            value: "Neurodivergenze",
                            label: "Neurodivergenze",
                          },
                          { value: "Disabilità", label: "Disabilità" },
                        ]}
                        onValueChange={field.onChange}
                        value={field.value}
                        placeholder="Seleziona categorie specifiche"
                        variant="inverted"
                        maxCount={3}
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
