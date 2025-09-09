"use client";

import {
  ChevronLeft,
  ChevronRight,
  
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface NavbarProps {
  currentStep: number;
  totalSteps: number;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  handleOnSubmit: () => void;
}

export default function Navbar({
  currentStep,
  totalSteps,
  handleNextStep,
  handlePrevStep,
  handleOnSubmit,
}: NavbarProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

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
            className="w-fit bg-secondary font-light"
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
              className="hover:text-primary flex items-center gap-1 text-secondary hover:bg-white  "
            >
              <ChevronLeft size={16} />
              Indietro
            </Button>
            <Button
              variant="default"
              onClick={handleNextStep}
              className="flex items-center gap-1 bg-secondary"
            >
              Avanti
              <ChevronRight size={16} />
            </Button>
          </>
        )}

        {isLastStep && (
          <>
            <Button
              variant="ghost"
              onClick={handlePrevStep}
              className="hover:text-accent flex items-center gap-1 text-secondary hover:bg-white"
            >
              <ChevronLeft size={16} />
              Indietro
            </Button>
            <Button
              variant="default"
              onClick={handleOnSubmit}
              className="flex items-center gap-1 bg-secondary"
            >
              Conferma e invia
              <ChevronRight size={16} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
