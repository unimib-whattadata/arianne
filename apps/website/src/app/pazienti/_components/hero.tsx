import Link from "next/link";
import { Button } from "~/components/ui/button";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section>
      <div className="grid place-items-start md:grid-cols-2">
        <div className="flex w-full items-start lg:pb-24">
          <Image
            src="/images/paziente-hero.png"
            width={719}
            height={804}
            alt="Immagine di un paziente"
            sizes="(max-width: 55rem) 100vw, 48rem"
          />
        </div>

        <div className="mb-16 grid max-w-prose items-center px-5 py-24 md:mb-0 md:place-self-center md:pl-16 lg:pl-24">
          <h1 className="text-h2 mb-4 font-bold sm:text-4xl">
            Ogni funzione è pensata
            <br />
            <span className="text-primary">per aiutarti davvero</span>
          </h1>

          <p className="mb-4 text-lg leading-relaxed">
            Con <strong>Arianne</strong> hai a disposizione uno{" "}
            <strong>spazio sicuro</strong> dove comunicare con il tuo
            <strong> terapeuta</strong>, monitorare come stai e accedere
            facilmente agli <strong>strumenti utili</strong> per il tuo percorso
          </p>

          <p className="mb-8 text-lg leading-relaxed">
            Puoi <strong>registrare sintomi</strong>, compilare{" "}
            <strong>questionari</strong> e ricevere{" "}
            <strong>indicazioni su misura</strong>
          </p>

          <div className="flex w-full gap-4">
            <Button asChild>
              <Link href="#">Scopri Arianne</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
