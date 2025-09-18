"use client";

import Image from "next/image";
import { InView } from "react-intersection-observer";
import { useInViewObserver } from "~/app/_context/in-view-observer";

export const AdvantagesSection = () => {
  const { setInView } = useInViewObserver();

  return (
    <InView threshold={1} onChange={setInView} key="advantages">
      {({ ref }) => (
        <section ref={ref} id="advantages" className="py-12 lg:py-24">
          <div className="container mx-auto grid place-items-center gap-16 px-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="grid place-content-center">
              <h2 className="text-h2 font-regular mb-4">
                <span className="text-secondary font-bold">
                  {" "}
                  Perché iscriversi?
                </span>
                <br className="hidden lg:inline" />
                Scoprine i vantaggi
              </h2>
              <p className="mt-8 mb-8">
                <strong className="bg-secondary rounded-sm px-2 text-white">
                  Maggiore visibilità
                </strong>
                <br />
                Il tuo profilo sarà trovato più facilmente da chi cerca un{" "}
                <strong>terapeuta online</strong>
              </p>
              <p className="mb-8">
                <strong className="bg-secondary rounded-sm px-2 text-white">
                  Meno burocrazia
                </strong>
                <br />
                Promemoria, gestione degli <strong>appuntamenti</strong> e dei{" "}
                <strong>pagamenti</strong> integrati
              </p>
              <p className="mb-8">
                <strong className="bg-secondary rounded-sm px-2 text-white">
                  Più controllo clinico
                </strong>
                <br />
                Dashboard e <strong>dati aggiornati in tempo reale</strong>,
                sempre disponibili ovunque
              </p>
              <p>
                <strong className="bg-secondary rounded-sm px-2 text-white">
                  Strumenti professionali
                </strong>
                <br />
                Accesso a <strong>videochiamate</strong>,{" "}
                <strong>test digitali</strong>, diario del paziente e molto
                altro
              </p>
            </div>
            <Image
              src="/images/arianne-esempio.png"
              width={777}
              height={342}
              sizes="(max-width: 55rem) 100vw, 777px"
              alt="Immagine di un paziente che utilizza Arianne insieme alla sua terapeuta"
              className="w-full lg:col-span-2"
            />
          </div>
        </section>
      )}
    </InView>
  );
};
