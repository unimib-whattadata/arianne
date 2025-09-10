import Link from "next/link";
import { Button } from "~/components/ui/button";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section>
      <div className="grid place-items-start md:grid-cols-2">
        <div className="order-1 mb-16 grid max-w-prose items-center px-5 py-24 text-center md:order-0 md:mb-0 md:place-self-center md:pr-16 md:text-left lg:pr-24">
          <h1 className="text-h2 mb-4 font-bold sm:text-4xl">
            <strong>Un ecosistema digitale</strong>
            <br className="hidden lg:inline-block" />
            per la{" "}
            <strong className="bg-primary text-secondary-foreground rounded-lg px-2">
              salute mentale
            </strong>
          </h1>

          <p className="mb-6 text-lg leading-relaxed">
            La piattaforma digitale che unisce <strong>ricerca clinica</strong>{" "}
            e <strong>innovazione tecnologica</strong> per rendere la{" "}
            <strong>psicoterapia online</strong> efficace, accessibile
            <br className="hidden md:inline-block" /> e centrata sui bisogni di{" "}
            <strong>pazienti</strong> e <strong>terapeuti</strong>
          </p>

          <div className="flex w-full justify-center gap-4 md:justify-start">
            <Button asChild>
              <Link href="/pazienti"> Per i pazienti</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/terapeuti"> Per i terapeuti</Link>
            </Button>
          </div>
        </div>

        <div className="order-0 flex w-full items-start justify-end md:order-1 lg:pb-24">
          <Image
            src="/images/home-hero.png"
            width={964}
            height={730}
            alt="Immagine di un terapeuta"
            sizes="(max-width: 55rem) 100vw, 48rem"
          />
        </div>
      </div>
      <div className="bg-primary flex items-center justify-center py-2 text-center text-sm text-white">
        <p>
          <strong>Coming soon!</strong> Il lancio della piattaforma è previsto
          per <strong>inizio 2026!</strong>
        </p>
      </div>
    </section>
  );
};
