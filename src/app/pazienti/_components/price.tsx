"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export const PriceSection = () => {
  return (
    <section id="price" className="scroll-mt-8 px-4 py-12 md:py-24">
      <div className="container mx-auto">
        <h2 className="text-h2 text-center font-semibold text-balance">
          Benessere mentale alla portata di chiunque
        </h2>
        <div className="mx-auto mt-8 grid w-full gap-10 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group gap-3 border-0 p-0 shadow-none md:max-lg:col-span-2">
            <CardContent className="p-0">
              <p>
                Con Arianne puoi iniziare un percorso di supporto psicologico
                online, accessibile e flessibile
              </p>

              <p>
                Il primo colloquio è gratuito, senza impegno, e puoi
                interrompere in qualsiasi momento
              </p>

              <p>
                Se decidi di continuare, ogni seduta ha un costo di soli 25 euro
                per il primo anno
              </p>
              <Button className="mt-6">Registrati</Button>
            </CardContent>
          </Card>

          <Card className="group bg-primary-light place-content-center gap-3 border-0 p-6 shadow-none">
            <CardHeader className="p-0">
              <h3 className="text-h3 font-medium">Gratis</h3>
            </CardHeader>

            <CardContent className="p-0">
              <p>Il primo colloquio</p>
              <ul className="list-disc pl-5">
                <li>
                  Conosci il professionista assegnatoti in base al questionario
                </li>
                <li>Capisci come funziona</li>
                <li>Decidi poi se continuare</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group bg-primary-light place-content-center gap-3 border-0 p-6 shadow-none">
            <CardHeader className="p-0">
              <h3 className="text-h3 font-medium">
                <span className="text-base font-normal">da</span> 35 euro
              </h3>
            </CardHeader>

            <CardContent className="p-0">
              <p>Tutte le sedute successive</p>
              <ul className="list-disc pl-5">
                <li>Conosci te stesso e lavora insieme al terapeuta</li>
                <li>Monitora i progressi tramite questionari</li>
                <li>Interrompi quando vuoi</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
