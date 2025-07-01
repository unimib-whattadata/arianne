import Link from "next/link";
import { Button } from "~/components/ui/button";

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative grid min-h-[70svh] place-items-center md:grid-cols-2"
    >
      <div className="grid max-w-sm gap-6">
        <h2 className="text-h2 font-medium">
          Un ecosistema digitale per la salute mentale
        </h2>
        <p>
          La piattaforma digitale che integra la ricerca clinica con
          l&apos;innovazione tecnologica per supportare la diagnosi, il
          monitoraggio e il trattamento dei disturbi mentali
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/pazienti">Per i pazienti</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/terapeuti">Per i terapeuti</Link>
          </Button>
        </div>
      </div>

      <div className="absolute top-0 right-0 md:w-2/3">
        <svg
          viewBox="0 0 991 687"
          className="text-primary h-full max-h-[780px] place-self-end"
          preserveAspectRatio="xMinYMid slice"
        >
          <image
            xlinkHref="/images/immagine-terapeuta.png"
            type="image/png"
            x="80"
            y="-60"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMin slice"
            clipPath="url(#clip-path)"
          />

          <defs>
            <clipPath id="clip-path">
              <path d="M1044.5 532.5V-54.5H131.5C131.5 -54.5 354.931 145.543 379 305C391.679 389 385.003 530.101 457 595C592.342 717 1044.5 532.5 1044.5 532.5Z" />
            </clipPath>
          </defs>

          <path
            id="path-hero"
            d="M1044.5 532.5V-54.5H131.5C131.5 -54.5 354.931 145.543 379 305C391.679 389 385.003 530.101 457 595C592.342 717 1044.5 532.5 1044.5 532.5Z"
            stroke="currentColor"
            fill="none"
            strokeWidth="100"
          />
          <text className="fill-primary-foreground text-6xl font-bold whitespace-nowrap">
            <textPath
              href="#path-hero"
              startOffset="55%"
              alignmentBaseline="middle"
            >
              Il filo digitale tra terapeuti e pazienti
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  );
};
