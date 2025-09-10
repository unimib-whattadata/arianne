"use client";

import Image from "next/image";
import { InView } from "react-intersection-observer";
import { useInViewObserver } from "~/app/_context/in-view-observer";

export const EfficacySection = () => {
  const { setInView } = useInViewObserver();

  return (
    <InView threshold={1} onChange={setInView} key="efficacy">
      {({ ref }) => (
        <section
          ref={ref}
          id="efficacy"
          className="bg-primary-light scroll-mt-8 py-12 lg:py-24"
        >
          <div className="container mx-auto grid place-content-center gap-16 px-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="grid place-content-center lg:col-span-2">
              <h2 className="text-h2 mb-6 font-bold">
                Ma il supporto di{" "}
                <span className="bg-primary text-secondary-foreground rounded-lg px-2">
                  Arianne
                </span>{" "}
                è davvero efficace?
              </h2>

              <p className="mb-4 text-lg leading-relaxed text-slate-900">
                <strong>Arianne</strong> nasce da un lavoro congiunto tra{" "}
                <strong>clinici</strong> e <strong>tecnologi</strong>, per
                offrire un supporto psicologico <strong>affidabile</strong>,{" "}
                <strong>accessibile</strong> e <strong>personalizzato</strong>
              </p>

              <p className="mb-4 text-lg leading-relaxed text-slate-900">
                Grazie a un <strong>percorso terapeutico guidato</strong> passo
                dopo passo e a <strong>strumenti digitali validati</strong>,
                Arianne rende la terapia <strong>efficace</strong> e vicina alle{" "}
                <strong>esigenze reali</strong> dei pazienti
              </p>

              <p className="mb-4 text-lg leading-relaxed text-slate-900">
                I professionisti che usano Arianne sono <strong>formati</strong>{" "}
                per offrire supporto qualificato anche da remoto e i{" "}
                <strong>dati raccolti</strong> aiutano a rendere ogni intervento
                più mirato
              </p>

              <p className="text-lg leading-relaxed text-slate-900">
                Le <strong>esperienze dei nostri utenti</strong> confermano ogni
                giorno il valore di questa scelta
              </p>
            </div>

            <Image
              src="/images/efficacia-paziente.png"
              width={418}
              height={627}
              sizes="(max-width: 55rem) 100vw, 418px"
              alt="Paziente che utilizza Arianne insieme alla sua terapeuta"
              className="hidden md:block"
            />
          </div>
        </section>
      )}
    </InView>
  );
};
