import Link from "next/link";
import { Button } from "~/components/ui/button";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section>
      <div className="grid place-items-start md:grid-cols-2">
        <div className="flex w-full items-start lg:pb-24">
          <Image
            src="/images/terapeuta-hero.png"
            width={718}
            height={784}
            alt="Immagine di un terapeuta"
            sizes="(max-width: 55rem) 100vw, 48rem"
          />
        </div>

        <div className="mb-16 grid max-w-prose items-center px-5 py-24 md:mb-0 md:place-self-center md:pl-16 lg:pl-24">
          <h1 className="text-h2 mb-6 font-bold sm:text-4xl">
            Porta la <span className="text-primary">pratica online</span>,
            <br className="hidden lg:inline-block" />
            in modo semplice e sicuro
          </h1>

          <p className="mb-4 text-lg leading-relaxed">
            <strong>Arianne</strong> è la piattaforma pensata per{" "}
            <strong>psicologi</strong>, <strong>psicoterapeuti</strong> e{" "}
            <strong>psichiatri</strong> che vogliono offrire un servizio{" "}
            <strong>completo</strong>, <strong>sicuro</strong> e{" "}
            <strong>digitale</strong>
          </p>

          <p className="mb-8 text-lg leading-relaxed">
            Con pochi strumenti integrati puoi{" "}
            <strong>gestire appuntamenti</strong>,
            <strong> seguire i pazienti online</strong>, raccogliere{" "}
            <strong>dati clinici</strong> e molto altro tutto da{" "}
            <strong>un unico spazio</strong>
          </p>

          <div className="flex w-full gap-4">
            <Button variant="secondary" asChild>
              <Link href="#">Manda la tua candidatura</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
