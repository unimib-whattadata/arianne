'use client';

import { Toaster } from 'sonner';
import { Megaphone, Wallet } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Fiscal() {
  return (
    <main className="h-full-safe flex flex-col items-center justify-center gap-10 md:min-h-screen">
      <div className="mt-8 flex w-full flex-1 flex-col gap-4 p-4 pt-12 md:mt-0 md:p-10 md:pt-24">
        <Toaster position="top-center" richColors />
        <div className="mx-auto flex max-w-3xl flex-col items-start">
          <Wallet className="text-primary h-10 w-10 sm:h-12 sm:w-12 md:mb-4" />
          <h1 className="mb-2 text-2xl font-semibold text-slate-900 sm:text-3xl md:mb-4 lg:text-4xl">
            Metodi di pagamento
          </h1>

          <p className="mb-2 text-sm leading-relaxed text-slate-700 sm:mb-8 sm:text-base md:mb-6">
            Per completare l’iscrizione, ti chiediamo di inserire un metodo di
            pagamento valido insieme ai dati personali richiesti
          </p>
        </div>
        <Card className="bg-secondary-light mx-auto flex w-full max-w-3xl flex-col justify-between rounded-2xl p-2 md:px-8 md:py-6">
          <CardContent className="w-full pb-2">
            <div className="flex w-full flex-col">
              <div className="flex w-full items-center justify-center gap-4 md:mb-2">
                <h2 className="text-center text-2xl font-semibold uppercase">
                  Coming soon!
                </h2>
                <Megaphone className="text-primary mt-2 h-10 w-10" />
              </div>

              <p className="mdtext-center text-sm text-slate-700">
                Stiamo lavorando per offrirti la migliore esperienza possibile.
                <br /> A breve potrai inserire i tuoi dati di pagamento in modo
                sicuro e semplice.
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="mx-auto mt-4 flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:gap-4 md:mt-10">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:flex-1"
            asChild
          >
            <Link
              href="/onboarding"
              className="text-primary w-full text-center"
            >
              Torna alla lista degli step
            </Link>
          </Button>
          <Button
            type="submit"
            variant="secondary"
            className="w-full sm:flex-1"
            disabled
          >
            Accedi ad Arianne{' '}
          </Button>
        </div>
      </div>
    </main>
  );
}
