"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Check } from "lucide-react";
import { InView } from "react-intersection-observer";
import { useInViewObserver } from "~/app/_context/in-view-observer";

export const PriceSection = () => {
  const { setInView } = useInViewObserver();

  return (
    <InView threshold={1} onChange={setInView} key="price">
      {({ ref }) => (
        <section
          ref={ref}
          id="price"
          className="scroll-mt-8 bg-slate-50 px-4 py-16 md:py-24"
        >
          <div className="container mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
                Benessere mentale alla portata di{" "}
                <strong className="text-primary">chiunque</strong>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                Con Arianne puoi iniziare un percorso di supporto psicologico
                online,{" "}
                <strong className="text-secondary">
                  accessibile e flessibile
                </strong>
              </p>
            </div>

            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              <Card className="flex flex-col border border-slate-200 bg-white p-6">
                <CardContent className="flex flex-1 flex-col p-0">
                  <h3 className="mb-3 text-xl font-semibold text-slate-900">
                    Primo colloquio gratuito
                  </h3>
                  <p className="mb-4 text-slate-600">
                    Senza impegno, per conoscerci
                  </p>
                  <ul className="mb-6 flex-1 space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Conosci il professionista assegnatoti</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Capisci come funziona</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Decidi poi se continuare</span>
                    </li>
                  </ul>
                  <Button variant="secondary" className="mt-auto w-full">
                    Prenota un colloquio
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-secondary flex flex-col p-6 text-white">
                <CardContent className="flex flex-1 flex-col p-0">
                  <h3 className="mb-3 text-xl font-semibold">
                    Sedute successive
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      da 50€<sup>*</sup>
                    </span>
                    <span className="ml-1 text-blue-100">a seduta</span>
                  </div>
                  <ul className="mb-6 flex-1 space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4" />
                      <span>Lavora insieme al terapeuta</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4" />
                      <span>Monitora i progressi</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4" />
                      <span>Interrompi quando vuoi</span>
                    </li>
                  </ul>

                  <p className="mt-2 text-xs text-blue-100">
                    *Il prezzo effettivo sarà stabilito dal terapeuta in base al
                    percorso.
                  </p>

                  <Button variant="default" className="mt-4 w-full">
                    Inizia il percorso
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </InView>
  );
};
