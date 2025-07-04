"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export const PriceSection = () => {
  return (
    <section
      id="price"
      className="bg-secondary-light scroll-mt-8 px-4 py-12 md:py-24"
    >
      <div className="container mx-auto">
        <h2 className="text-h2 font-semibold text-balance">
          Come funziona
          <br className="hidden lg:inline" />
          l&apos;accesso ad Arianne
        </h2>
        <div className="mx-auto mt-8 grid w-full gap-10 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group bg-secondary-light gap-3 border-0 p-0 shadow-none md:max-lg:col-span-2">
            <CardContent className="p-0">
              <p>
                Vogliamo rendere Arianne accessibile, per tutti i
                professionisti. Per questo abbiamo scelto un abbonamento mensile
                fisso e senza commissioni sulle sedute
              </p>

              <p>
                Ogni terapeuta ha accesso agli stessi strumenti avanzati,
                indipendentemente dal numero di pazienti o ore lavorate
              </p>

              <p>
                In più, la prova gratuita di 14 giorni ti permette di conoscere
                la piattaforma senza impegno
              </p>
              <Button variant="secondary" className="mt-6">
                Inizia la prova
              </Button>
            </CardContent>
          </Card>

          <Card className="group place-content-center gap-3 border-0 p-6 shadow-none">
            <CardHeader className="p-0">
              <h3 className="text-h3 font-medium">Prova gratuita</h3>
            </CardHeader>

            <CardContent className="p-0">
              <p>Per i primi 14 giorni</p>
              <ul className="list-disc pl-5">
                <li>Nessun pagamento iniziale</li>
                <li>Esplora tutte le funzionalità</li>
                <li>Conosci la piattaforma</li>
                <li>Decidi liberamente se continuare</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group place-content-center gap-3 border-0 p-6 shadow-none">
            <CardHeader className="p-0">
              <h3 className="text-h3 font-medium">15 euro</h3>
            </CardHeader>

            <CardContent className="p-0">
              <p>Abbonamento mensile</p>
              <ul className="list-disc pl-5">
                <li>Nessuna commissione</li>
                <li>Somministra e analizza questionari</li>
                <li>Interrompi quando vuoi, senza vincoli</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
