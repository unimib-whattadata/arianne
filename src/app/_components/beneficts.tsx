"use client";

import { Button } from "~/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { cn } from "~/lib/utils";

const CAPTION_TEXT = {
  patients:
    "Arianne offre un supporto personalizzato e continuo, facilitando il percorso terapeutico con un monitoraggio attento, utile a mantenere il benessere nel tempo. La terapia è accessibile ovunque e in qualsiasi momento, per un'esperienza più flessibile ed efficace.",
  therapists:
    "La piattaforma offre la possibilità di una terapia più efficiente e organizzata, consentendo il monitoraggio dei pazienti in tempo reale per interventi più mirati e contribuendo così alla riduzione delle ospedalizzazioni e dei costi sanitari",
};

export const BenefitsSection = () => {
  const [selectedTab, setSelectedTab] = useState<"patients" | "therapists">(
    "patients",
  );

  const handleTabChange = (tab: "patients" | "therapists") => {
    if (selectedTab === tab) return;
    setSelectedTab(tab);
  };

  return (
    <section id="benefits" className="scroll-mt-8">
      <div className="mx-auto grid w-full max-w-3xl place-items-center gap-8 px-4 py-12 md:grid-cols-2 md:place-items-center md:py-24 lg:grid-cols-3 lg:gap-12 lg:px-0">
        <div className="grid place-items-center gap-8 md:place-items-start">
          <h2 className="text-h3 font-medium">I Benefici di Arianne</h2>
          <div className="grid place-items-center gap-5 md:place-items-start">
            <Button
              variant="link"
              className={cn(
                "text-h2! text-secondary px-0",
                selectedTab === "patients" && "text-foreground font-bold",
              )}
              onClick={() => handleTabChange("patients")}
            >
              Per i Pazienti
            </Button>
            <Button
              variant="link"
              className={cn(
                "text-h2! text-secondary px-0",
                selectedTab === "therapists" && "text-foreground font-bold",
              )}
              onClick={() => handleTabChange("therapists")}
            >
              Per i Terapeuti
            </Button>
          </div>
          <Button variant="secondary" className="hidden md:inline-flex">
            Scopri cosa ti offre
          </Button>
        </div>
        <div className="grid gap-8 lg:col-span-2">
          <Image
            src="/images/benefici-pazienti.png"
            alt="Benefici per i Pazienti"
            width={558}
            height={400}
            sizes="(max-width: 55rem) 100vw, 31rem"
            className="w-full rounded-lg"
          />
          <p>{CAPTION_TEXT[selectedTab]}</p>
        </div>
        <Button variant="secondary" className="w-fit md:hidden">
          Scopri cosa ti offre
        </Button>
      </div>
    </section>
  );
};
