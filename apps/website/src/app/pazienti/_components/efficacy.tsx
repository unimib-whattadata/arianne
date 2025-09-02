import Image from "next/image";

export const EfficacySection = () => {
  return (
    <section
      id="efficacy"
      className="bg-primary-light scroll-mt-8 py-12 lg:py-24"
    >
      <div className="container mx-auto grid place-content-center gap-16 px-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="grid place-content-center lg:col-span-2">
          <h2 className="text-h2 mb-4 font-medium">
            Ma il supporto di Arianne è davvero efficace?
          </h2>
          <p>
            Arianne nasce da un lavoro congiunto tra clinici e tecnologi, per
            offrire un supporto psicologico affidabile, accessibile e
            personalizzato
          </p>
          <p>
            Grazie ad un percorso terapeutico guidato passo passo e strumenti
            digitali affidabili e approvati da psicologici, Arianne rende il
            percorso terapeutico efficace e vicino alle esigenze reali dei
            pazienti
          </p>
          <p>
            I professionisti che usano Arianne sono formati per offrire supporto
            qualificato anche da remoto e, i dati raccolti, aiutano a rendere
            ogni intervento più mirato
          </p>
          <p>
            Le esperienze dei nostri utenti confermano ogni giorno il valore di
            questa scelta
          </p>
        </div>
        <Image
          src="/images/efficacia-paziente.png"
          width={418}
          height={627}
          sizes="(max-width: 55rem) 100vw, 418px"
          alt="Immagine di un paziente che utilizza Arianne insieme alla sua terapeuta"
          className="hidden md:block"
        />
      </div>
    </section>
  );
};
