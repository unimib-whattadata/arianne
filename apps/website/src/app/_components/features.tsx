"use client";

import Image from "next/image";
import { InView } from "react-intersection-observer";
import { useInViewObserver } from "../_context/in-view-observer";

export const FeaturesSection = () => {
  const { setInView } = useInViewObserver();

  return (
    <InView threshold={0.8} onChange={setInView} key="features">
      {({ ref }) => (
        <section
          ref={ref}
          id="features"
          className="bg-secondary-light scroll-mt-8 px-4 pt-12 lg:pt-24"
        >
          <div className="container mx-auto grid place-items-center gap-6">
            <h2 className="text-h3 md:text-h2 lg:text-h1 max-w-3xl text-center font-semibold">
              Arianne è una{" "}
              <strong className="bg-secondary text-secondary-foreground rounded-lg px-2">
                piattaforma integrata
              </strong>{" "}
              con un&apos;app per i pazienti e una dashboard per i terapeuti
            </h2>
            <div className="max-h-80 w-full max-w-3xl overflow-clip">
              <Image
                src="/images/esempio-piattaforma.webp"
                alt="Piattaforma Arianne"
                width={375}
                height={220}
                sizes="(max-width: 55rem) 100vw, 48rem"
                className="w-full object-cover pb-10"
              />
            </div>
          </div>
        </section>
      )}
    </InView>
  );
};
