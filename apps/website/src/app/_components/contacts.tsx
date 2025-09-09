import { Button } from "~/components/ui/button";

export const ContactsSection = () => {
  return (
    <section id="contacts" className="relative scroll-mt-8 py-12 lg:py-24">
      <div className="container mx-auto grid max-w-prose px-4 text-center">
        <h2 className="text-h2 mb-4 font-medium">
          Vuoi saperne di più su Arianne?
        </h2>
        <p>
          Che tu sia un <strong>professionista della salute mentale</strong> o
          una persona alla ricerca di un percorso di supporto, siamo qui per te
        </p>
        <p>
          Arianne nasce per semplificare{" "}
          <strong>l&apos;incontro tra terapeuti e pazienti</strong>, offrendo
          uno spazio sicuro, flessibile e completo. Scopri come può fare la
          differenza per il tuo benessere o per il tuo lavoro
        </p>

        <p>
          Per maggiori informazioni, scrivici a{" "}
          <strong className="text-primary underline">
            marco.cremaschi@whattadata.it
          </strong>
        </p>
      </div>
    </section>
  );
};
