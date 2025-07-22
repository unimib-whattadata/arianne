import Image from "next/image";

export const AdvantagesSection = () => {
  return (
    <section className="py-12 lg:py-24">
      <div className="container mx-auto grid place-items-center gap-16 px-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="grid place-content-center">
          <h2 className="text-h2 mb-4 font-medium">
            Perché iscriversi?
            <br className="hidden lg:inline" />
            Scoprine i vantaggi
          </h2>
          <p>
            <strong className="bg-secondary rounded-sm px-2 text-white">
              Maggiore visibilità
            </strong>
            <br />
            Il tuo profilo può essere trovato velocemente da chi cerca un
            terapeuta online
          </p>
          <p>
            <strong className="bg-secondary rounded-sm px-2 text-white">
              Meno burocrazia
            </strong>
            <br />
            Promemoria, gestione appuntamenti e pagamenti integrati
          </p>
          <p>
            <strong className="bg-secondary rounded-sm px-2 text-white">
              Più controllo clinico
            </strong>
            <br />
            Dashboard e dati aggiornati in tempo reale, sempre, ovunque
          </p>
          <p>
            <strong className="bg-secondary rounded-sm px-2 text-white">
              Strumenti professionali
            </strong>
            <br />
            Presenza di videochiamate, test digitali, diario del paziente e
            molto altro
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
  );
};
