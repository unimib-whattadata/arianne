"use client";

import { Button } from "~/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { cn } from "~/lib/utils";

const CAPTION_TEXT = {
  patients:
    "Arianne garantisce un supporto personalizzato e costante, un un monitoraggio efficace che aiuta a prevenire ospedalizzazioni e ricadute, l'accessibilità alla terapia in qualsiasi momento e luogo, e una maggiore efficacia del percorso terapeutico ",
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
    <section id="benefits">
      <div className="container mx-auto grid grid-cols-3 place-items-center gap-12 py-32">
        <div className="grid place-items-start gap-8">
          <h2 className="text-medium text-h3">I Benefici di Arianne</h2>
          <div className="grid place-items-start gap-5">
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
          <Button>Scopri come iscriverti</Button>
        </div>
        <div className="col-span-2 grid gap-8">
          <Image
            src="/images/benefici-pazienti.png"
            alt="Benefici per i Pazienti"
            width={558}
            height={400}
            className="w-full rounded-lg"
          />
          <p>{CAPTION_TEXT[selectedTab]}</p>
        </div>
      </div>
    </section>
  );
};
