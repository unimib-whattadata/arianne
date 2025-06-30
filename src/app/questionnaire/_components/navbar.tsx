"use client";

import {
  Apple,
  ChevronLeft,
  ChevronRight,
  GanttChartSquare,
  Mail,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface NavbarProps {
  currentStep: number;
  handleNextStep: () => void;
  handlePrevStep: () => void;
}

const stepLabels = [
  "Benvenuto",
  "Chi sei",
  "Motivazioni",
  "Preferenze",
  "Riepilogo",
  "Conferma",
];

export default function Navbar({
  currentStep,
  handleNextStep,
  handlePrevStep,
}: NavbarProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === 20;

  return (
    <div className="w-full items-center bg-white px-4 py-3 md:px-6">
      <div
        className={cn(
          `flex items-center ${isFirstStep ? "flex-col gap-2" : "flex-row justify-center gap-40"}`,
        )}
      >
        {isFirstStep && (
          <Button
            variant="default"
            onClick={handleNextStep}
            className="w-fit bg-[#006279] font-light"
          >
            Procediamo
            <ChevronRight className="h-4 w-4 px-0" />
          </Button>
        )}

        {!isFirstStep && !isLastStep && (
          <>
            <Button
              variant="ghost"
              onClick={handlePrevStep}
              className="hover:text-accent flex items-center gap-1 text-[#006279] hover:bg-white"
            >
              <ChevronLeft size={16} />
              Indietro
            </Button>
            <Button
              variant="default"
              onClick={handleNextStep}
              className="flex items-center gap-1 bg-[#006279]"
            >
              Avanti
              <ChevronRight size={16} />
            </Button>
          </>
        )}

        {isLastStep && (
          <>
            <Button
              type="button"
              className="flex items-center gap-2 bg-[#006279] text-white"
            >
              <Mail size={16} />
              Registrati tramite mail
            </Button>
            <Button
              type="button"
              className="flex items-center gap-2 bg-red-500 text-white"
            >
              <GanttChartSquare size={16} />
              Registrati tramite Google
            </Button>
            <Button
              type="button"
              className="flex items-center gap-2 bg-black text-white"
            >
              <Apple size={16} />
              Registrati tramite Apple
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
