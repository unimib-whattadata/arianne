"use client";

import { Button } from "~/components/ui/button";
import Image from "next/image";
import { useState } from "react";

import { cn } from "~/lib/utils";
import { Users, Stethoscope } from "lucide-react";
import { useInViewObserver } from "../_context/in-view-observer";
import { InView } from "react-intersection-observer";

const CAPTION_TEXT = {
  patients:
    "Arianne offre un supporto personalizzato e continuo, con un monitoraggio attento che accompagna il percorso terapeutico. La terapia diventa accessibile in ogni momento e luogo, offrendo un'esperienza più flessibile e sempre efficace",
  therapists:
    "Arianne permette una gestione più efficiente e organizzata, con il monitoraggio dei pazienti in tempo reale. Questo consente interventi mirati e tempestivi, riducendo il rischio di ospedalizzazioni e i costi complessivi della terapia",
};

const BENEFITS = {
  patients: [
    "Supporto personalizzato 24/7",
    "Monitoraggio continuo del benessere",
    "Accesso flessibile ovunque",
    "Percorso terapeutico guidato",
  ],
  therapists: [
    "Monitoraggio pazienti in tempo reale",
    "Interventi più mirati ed efficaci",
    "Riduzione ospedalizzazioni",
    "Gestione organizzata dei casi",
  ],
};

export const BenefitsSection = () => {
  const [selectedTab, setSelectedTab] = useState<"patients" | "therapists">(
    "patients",
  );

  const handleTabChange = (tab: "patients" | "therapists") => {
    if (selectedTab === tab) return;
    setSelectedTab(tab);
  };

  const { setInView } = useInViewObserver();

  return (
    <InView threshold={0.8} onChange={setInView} key="beneficts">
      {({ ref }) => (
        <section
          ref={ref}
          id="beneficts"
          className="scroll-mt-8 bg-gradient-to-br from-slate-50 to-blue-50/30"
        >
          <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                I Benefici di{" "}
                <strong className="bg-primary text-secondary-foreground rounded-lg px-2">
                  Arianne
                </strong>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Scopri come la nostra piattaforma trasforma l&apos;esperienza
                terapeutica per pazienti e professionisti
              </p>
            </div>

            <div className="mb-12 flex justify-center">
              <div className="rounded-[2rem] border bg-white p-2 shadow-lg md:rounded-full">
                <div className="gap-2 md:flex">
                  <button
                    onClick={() => handleTabChange("patients")}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-full px-6 py-3 font-medium transition-all duration-300 md:w-auto",
                      selectedTab === "patients"
                        ? "bg-primary text-white shadow-md"
                        : "hover:text-primary text-gray-600 hover:bg-blue-50",
                    )}
                  >
                    <Users className="h-4 w-4" />
                    Per i pazienti
                  </button>
                  <button
                    onClick={() => handleTabChange("therapists")}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-full px-6 py-3 font-medium transition-all duration-300 md:w-auto",
                      selectedTab === "therapists"
                        ? "bg-primary text-white shadow-md"
                        : "hover:text-primary text-gray-600 hover:bg-blue-50",
                    )}
                  >
                    <Stethoscope className="h-4 w-4" />
                    Per i terapeuti
                  </button>
                </div>
              </div>
            </div>

            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <div className="aspect-[3/2] w-full">
                    <Image
                      src={
                        selectedTab === "patients"
                          ? "/images/benefici-pazienti.webp"
                          : "/images/benefici-terapeuta.webp"
                      }
                      alt={
                        selectedTab === "patients"
                          ? "Benefici per i pazienti"
                          : "Benefici per i terapeuti"
                      }
                      width={1116}
                      height={800}
                      className="h-full w-full transition-opacity duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedTab === "patients"
                      ? "Vantaggi per i pazienti"
                      : "Vantaggi per i terapeuti"}
                  </h3>

                  <p className="text-lg leading-relaxed text-gray-600">
                    {CAPTION_TEXT[selectedTab]}
                  </p>

                  <div className="space-y-3">
                    {BENEFITS[selectedTab].map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm"
                      >
                        <span className="font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <Button size="lg" variant={"default"}>
                Scopri cosa ti offre
              </Button>
            </div>
          </div>
        </section>
      )}
    </InView>
  );
};
