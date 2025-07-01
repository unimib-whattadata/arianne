import { Button } from "~/components/ui/button";

export const ContactsSection = () => {
  return (
    <section
      id="contacts"
      className="bg-secondary-light relative rounded-lg pt-32 pb-76"
    >
      <div className="container mx-auto grid max-w-prose text-center">
        <h2 className="text-h2 mb-4 font-medium">
          Vuoi saperne di più su Arianne?
        </h2>
        <p>
          Che tu sia un professionista della salute mentale o una persona alla
          ricerca di un percorso di supporto, siamo qui per te.
        </p>
        <p>
          Arianne nasce per semplificare l&apos;incontro tra terapeuti e
          pazienti, offrendo uno spazio sicuro, flessibile e completo.Scopri
          come può fare la differenza per il tuo benessere o per il tuo lavoro
          clinico
        </p>
        <Button variant="secondary" className="mx-auto mt-6">
          Contattaci
        </Button>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1280 395"
        fill="none"
        className="text-primary absolute bottom-34 h-auto max-h-[300px] w-full"
      >
        <path
          d="M-88.2939 39.5947C-88.2939 39.5947 279.167 337.322 582.048 343.903C804.28 348.732 947.861 243.533 1168.24 271.903C1247.95 282.164 1300.6 302.935 1300.6 302.935"
          stroke="currentColor"
          strokeWidth="100"
          id="path-contacts"
        />

        <text className="fill-primary-foreground text-6xl font-bold whitespace-nowrap">
          <textPath
            href="#path-contacts"
            startOffset="8%"
            alignmentBaseline="middle"
          >
            Vuoi conoscere la nostra piattaforma?
          </textPath>
        </text>
      </svg>
    </section>
  );
};
