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
            alt="Immagine di un terapeuta"
            sizes="(max-width: 55rem) 100vw, 48rem"
          />
        </div>

        <div className="mb-16 grid max-w-prose items-center px-5 py-24 md:mb-0 md:place-self-center md:pl-16 lg:pl-24">
          <h1 className="text-h2 mb-4 font-medium sm:text-4xl">
            Ogni funzione è pensata
            <br className="hidden lg:inline-block" />
            per aiutarti davvero
          </h1>
          <p className="leading-relaxed">
            Con Arianne hai a disposizione uno spazio sicuro dove comunicare con
            il tuo terapeuta, monitorare come stai e accedere facilmente agli
            strumenti utili per il tuo percorso
          </p>
          <p className="mb-8 leading-relaxed">
            Puoi registrare sintomi, compilare questionari e ricevere
            indicazioni su misura
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
