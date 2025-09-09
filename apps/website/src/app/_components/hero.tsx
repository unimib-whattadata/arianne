import Link from "next/link";
import { Button } from "~/components/ui/button";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section>
      <div className="grid place-items-start md:grid-cols-2">
        <div className="order-1 mb-16 grid max-w-prose items-center px-5 py-24 text-center md:order-0 md:mb-0 md:place-self-center md:pr-16 md:text-left lg:pr-24">
          <h1 className="text-h2 mb-4 font-medium sm:text-4xl">
            un ecosistema digitale
            <br className="hidden lg:inline-block" />
            per la salute mentale
          </h1>
          <p className="mb-8 leading-relaxed">
            La piattaforma digitale che unisce ricerca clinica e innovazione
            tecnologica per rendere la psicoterapia online efficace, accessibile
            e centrata sui bisogni di pazienti e terapeuti
          </p>
          <div className="flex w-full justify-center gap-4 md:justify-start">
            <Button asChild>
              <Link href="/pazienti">Per i pazienti</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/terapeuti">Per i terapeuti</Link>
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
      <div className="bg-primary flex items-center justify-center py-2 text-sm text-white">
        <p>
          <strong>Coming soon!</strong> Il lancio della piattaforma è previsto
          per <strong>inizio 2026!</strong>
        </p>
      </div>
    </section>
  );
};
