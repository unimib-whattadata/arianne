import { Button } from "~/components/ui/button";

export const ContactsSection = () => {
  return (
    <section
      id="contacts"
      className="bg-secondary-light relative scroll-mt-8 py-12 lg:py-24"
    >
      <div className="container mx-auto grid max-w-prose px-4 text-center">
        <h2 className="text-h2 mb-4 font-medium">
          Vuoi saperne di più su Arianne?
        </h2>
        <p>
          Che tu sia un professionista della salute mentale o una persona alla
          ricerca di un percorso di supporto, siamo qui per te
        </p>
        <p>
          Arianne nasce per semplificare l&apos;incontro tra terapeuti e
          pazienti, offrendo uno spazio sicuro, flessibile e completo. Scopri
          come può fare la differenza per il tuo benessere o per il tuo lavoro
        </p>
        <Button variant="secondary" className="mx-auto mt-6">
          Contattaci
        </Button>
      </div>
    </section>
  );
};
