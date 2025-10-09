'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
    <div className="fixed bottom-0 w-full items-center px-4 pt-2 pb-6 md:px-6">
      <div
        className={cn(
          `flex items-center ${isFirstStep ? 'flex-col gap-2' : 'flex-row justify-center gap-4 md:gap-40'}`,
        )}
      >
        {isFirstStep && (
          <div className="flex w-full max-w-3xl items-center justify-center gap-4 md:gap-40">
            <Button
              variant="outline"
              className="hover:text-primary text-secondary border-secondary hover:border-primary flex w-full items-center gap-1 border bg-white hover:bg-white md:w-fit"
            >
              <Link
                href="/onboarding"
                className="flex items-center gap-1 text-center"
              >
                <ChevronLeft size={16} />
                Torna agli step
              </Link>
            </Button>
            <Button
              variant="default"
              onClick={handleNextStep}
              className="bg-secondary w-full font-light md:w-fit"
            >
              Procediamo
              <ChevronRight className="h-4 w-4 px-0" />
            </Button>
          </div>
        )}

        {!isFirstStep && !isLastStep && (
          <>
            <Button
              variant="outline"
              onClick={handlePrevStep}
              className="hover:text-primary text-secondary border-secondary hover:border-primary flex w-full items-center gap-1 border bg-white hover:bg-white md:w-fit"
            >
              <ChevronLeft size={16} />
              Indietro
            </Button>
            <Button
              variant="default"
              onClick={handleNextStep}
              className="bg-secondary flex w-full items-center gap-1 md:w-fit"
            >
              Avanti
              <ChevronRight size={16} />
            </Button>
          </>
        )}

        {isLastStep && (
          <>
            <Button
              variant="outline"
              onClick={handlePrevStep}
              className="hover:text-primary text-secondary border-secondary hover:border-primary flex w-full items-center gap-1 border bg-white hover:bg-white md:w-fit"
            >
              <ChevronLeft size={16} />
              Indietro
            </Button>
            <Button
              variant="default"
              onClick={handleOnSubmit}
              className="bg-secondary flex w-full items-center gap-1 md:w-fit"
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
