"use client";

import { InView } from "react-intersection-observer";
import { useInViewObserver } from "../_context/in-view-observer";

export const ContactsSection = () => {
  const { setInView } = useInViewObserver();

  return (
    <InView threshold={1} onChange={setInView} key="contacts">
      {({ ref }) => (
        <section
          ref={ref}
          id="contacts"
          className="relative scroll-mt-8 py-12 lg:py-24"
        >
          <div className="container mx-auto grid max-w-prose px-4 md:text-center">
            <h1 className="text-h2 mb-4 font-bold sm:text-4xl">
              Vuoi saperne di più su Arianne?
            </h1>
            <p className="mb-6 leading-relaxed md:text-lg">
              Che tu sia un <strong>professionista della salute mentale</strong>{" "}
              o una persona alla ricerca di un{" "}
              <strong>percorso di supporto</strong>, siamo qui per te
            </p>
            <p className="mb-6 leading-relaxed md:text-lg">
              Arianne nasce per semplificare{" "}
              <strong>l&apos;incontro tra terapeuti e pazienti</strong>,
              offrendo uno spazio sicuro, flessibile e completo. Scopri come può{" "}
              <strong>fare la differenza</strong> per il tuo benessere o per il
              tuo lavoro
            </p>

            <p className="mb-6 leading-relaxed md:text-lg">
              Per maggiori informazioni, scrivici a{" "}
              <strong className="text-primary underline">
                marco.cremaschi@whattadata.it
              </strong>
            </p>
          </div>
        </section>
      )}
    </InView>
  );
};
