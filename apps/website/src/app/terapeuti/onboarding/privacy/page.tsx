"use client";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import Link from "next/link";
import { Wallet } from "lucide-react";

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";

interface FiscalFormData {
  contratto: string;
}

export default function Fiscal() {
  const form = useForm<FiscalFormData>({
    defaultValues: {
      contratto: "",
    },
  });

  const onSubmit: SubmitHandler<FiscalFormData> = (data) => {
    console.log("Form data:", data);
  };

  return (
    <main className="min-h-safe px-6 py-36 sm:px-8 lg:px-12 lg:py-36">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mx-auto flex max-w-3xl flex-col items-start">
            <Wallet className="text-primary mb-4 h-10 w-10 sm:h-12 sm:w-12" />
            <h1 className="mb-4 text-2xl font-medium text-slate-900 sm:text-3xl lg:text-4xl">
              Accordi, privacy e accesso alla piattaforma
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-slate-700 sm:mb-8 sm:text-base">
              Ultimo passaggio! Firma il contratto, accetta i termini e
              preparati ad accedere all’area riservata per iniziare il tuo
              lavoro con noi.
            </p>

            <FormField
              control={form.control}
              name="contratto"
              rules={{ required: "Il contratto è obbligatorio" }}
              render={({ field }) => (
                <FormItem className="mt-4 w-full">
                  <p className="text-slate-900 sm:text-base">Contratto</p>
                  <FormControl>
                    <Input
                      className="mt-2 w-full"
                      placeholder="Inserisci il tuo contratto"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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
                  href="/terapeuti/onboarding"
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
