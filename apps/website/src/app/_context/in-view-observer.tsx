"use client";

import { createContext, useContext, useState } from "react";
import { useInView } from "react-intersection-observer";

interface InViewObserverContextProps {
  inView: boolean;
  ref: (node?: Element | null) => void;
  setInView: (inView: boolean, entry: IntersectionObserverEntry) => void;
  visibleSection: string | null;
}

export const InViewObserverContext = createContext<InViewObserverContextProps>(
  {} as InViewObserverContextProps,
);

export const InViewObserverProvider = (props: {
  children: React.ReactNode;
}) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    trackVisibility: true,
  });

  const [visibleSection, setVisibleSection] = useState<string | null>(null);

  const setInView = (inView: boolean, entry: IntersectionObserverEntry) => {
    if (inView) {
      setVisibleSection(entry.target.getAttribute("id"));
    }
  };

  return (
    <InViewObserverContext.Provider
      value={{
        inView,
        ref,
        setInView,
        visibleSection,
      }}
      {...props}
    />
  );
};

export const InViewObserverDisplayName = "InViewObserverContext";

export const useInViewObserver = () => {
  const context = useContext(InViewObserverContext);
  if (context === undefined) {
    throw new Error(
      "useInViewObserver must be used within an InViewObserverProvider",
    );
  }
  return context;
};
