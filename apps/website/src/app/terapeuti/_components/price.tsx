"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Check } from "lucide-react";

export const PriceSection = () => {
  return (
    <section id="price" className="scroll-mt-8 bg-slate-50 px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Come funziona <strong className="text-primary">Arianne</strong>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            A differenza delle altre piattaforme, paghi sempre{" "}
            <strong className="text-secondary"> la stessa cifra</strong>
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Card className="border border-slate-200 bg-white p-6">
            <CardContent className="p-0">
              <h3 className="mb-3 text-xl font-semibold text-slate-900">
                Prova gratuita
              </h3>
              <p className="mb-4 text-slate-600">14 giorni per testare tutto</p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Accesso completo</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Nessun pagamento</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Disdici senza nessun conto</span>
                </li>
              </ul>
              <Button variant="secondary" className="w-full">
                Inizia gratis
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-secondary p-6 text-white">
            <CardContent className="p-0">
              <h3 className="mb-3 text-xl font-semibold">Piano mensile</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">15€</span>
                <span className="ml-1 text-blue-100">al mese</span>
              </div>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4" />
                  <span>Pazienti illimitati</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4" />
                  <span>Disdici quando vuoi</span>
                </li>
              </ul>
              <Button variant="default" className="w-full">
                Scegli questo piano
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
