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
          <h1 className="text-h2 mb-4 font-medium sm:text-4xl">
            Porta la pratica online, in
            <br className="hidden lg:inline-block" />
            modo semplice e sicuro
          </h1>
          <p className="leading-relaxed">
            Arianne è la piattaforma pensata per psicologi, psicoterapeuti e
            psichiatri che vogliono offrire un servizio completo, sicuro e
            digitale
          </p>
          <p className="mb-8 leading-relaxed">
            Con pochi strumenti integrati puoi gestire appuntamenti, seguire i
            pazienti online, raccogliere dati clinici e molto altro, tutto da un
            unico spazio
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
