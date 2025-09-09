"use client";

import { Button } from "~/components/ui/button";
import Image from "next/image";
import { useState } from "react";

import { cn } from "~/lib/utils";
import { Users, Stethoscope, ArrowRight, CheckCircle } from "lucide-react";

const CAPTION_TEXT = {
  patients:
    "Arianne offre un supporto personalizzato e continuo, facilitando il percorso terapeutico con un monitoraggio attento, utile a mantenere il benessere nel tempo. La terapia è accessibile ovunque e in qualsiasi momento, per un'esperienza più flessibile ed efficace.",
  therapists:
    "La piattaforma offre la possibilità di una terapia più efficiente e organizzata, consentendo il monitoraggio dei pazienti in tempo reale per interventi più mirati e contribuendo così alla riduzione delle ospedalizzazioni e dei costi sanitari",
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

  return (
    <section
      id="benefits"
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
          <div className="rounded-full border bg-white p-2 shadow-lg">
            <div className="flex gap-2">
              <button
                onClick={() => handleTabChange("patients")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-all duration-300",
                  selectedTab === "patients"
                    ? "bg-primary text-white shadow-md"
                    : "hover:text-primary text-gray-600 hover:bg-blue-50",
                )}
              >
                <Users className="h-4 w-4" />
                Per i Pazienti
              </button>
              <button
                onClick={() => handleTabChange("therapists")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-all duration-300",
                  selectedTab === "therapists"
                    ? "bg-primary text-white shadow-md"
                    : "hover:text-primary text-gray-600 hover:bg-blue-50",
                )}
              >
                <Stethoscope className="h-4 w-4" />
                Per i Terapeuti
              </button>
            </div>
          </div>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={
                  selectedTab === "patients"
                    ? "/images/benefici-pazienti.png"
                    : "/images/benefici-pazienti.png"
                }
                alt={
                  selectedTab === "patients"
                    ? "Benefici per i Pazienti"
                    : "Benefici per i Terapeuti"
                }
                width={600}
                height={400}
                className="h-auto w-full transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-100 opacity-60" />
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-purple-100 opacity-40" />
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedTab === "patients"
                  ? "Vantaggi per i Pazienti"
                  : "Vantaggi per i Terapeuti"}
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
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            size="lg"
            className="group bg-primary hover:bg-primary/80 rounded-full px-8 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            Scopri cosa ti offre
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};
