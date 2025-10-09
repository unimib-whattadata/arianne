'use client';

import { useCookiesNext } from 'cookies-next';
import { useSearchParams } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

interface StepContextType {
  currentStep: number;
  steps: number;
  handleNext: () => void;
  handleBack: () => void;
}

export const StepsContext = createContext<StepContextType>(
  {} as StepContextType,
);

export const useSteps = () => useContext(StepsContext);

export function StepsProvider({
  children,
  steps,
}: {
  children: React.ReactNode;
  steps: number;
}) {
  const searchParams = useSearchParams();
  const id = searchParams.get('id')!;

  const { getCookie, setCookie } = useCookiesNext();
  const cookie = getCookie(id);
  const initialStep = cookie ? Number(cookie) : 1;

  const [currentStep, _setCurrentStep] = useState(initialStep);
  const setCurrentStep = (callback: (value: number) => number) => {
    const value = callback(currentStep);
    if (value === currentStep) return;
    _setCurrentStep(value);
    setCookie(id, value, {
      path: '/',
      expires: new Date(new Date().setHours(23, 59, 59, 0)),
    });
  };

  useEffect(() => {
    if (!cookie) return;
    if (initialStep === currentStep) return;
    _setCurrentStep(initialStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStep]);

  const handleNext = () => {
    setCurrentStep((prev) => {
      if (prev + 1 <= steps) return prev + 1;
      return prev;
    });
  };

  const handleBack = () => {
    setCurrentStep((prev) => {
      if (prev - 1 > 0) return prev - 1;
      return prev;
    });
  };

  const value = {
    currentStep,
    steps,
    handleNext,
    handleBack,
  };
  return (
    <StepsContext.Provider value={value}>{children}</StepsContext.Provider>
  );
}
