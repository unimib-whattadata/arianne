"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useInViewObserver } from "../_context/in-view-observer";
import { InView } from "react-intersection-observer";

export const CollaborationSection = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { setInView } = useInViewObserver();

  return (
    <InView threshold={0.8} onChange={setInView} key="collaboration">
      {({ ref }) => (
        <section
          ref={ref}
          id="collaboration"
          className="bg-secondary-light relative scroll-mt-8 py-12 lg:py-24"
        >
          <div className="container mx-auto grid max-w-prose px-4 text-center">
            <h1 className="text-h2 mb-4 font-bold sm:text-4xl">
              Un progetto costruito{" "}
              <strong className="bg-secondary text-secondary-foreground rounded-lg px-2 leading-relaxed">
                insieme
              </strong>
            </h1>

            <p className="mb-6 text-lg leading-relaxed">
              Arianne è un prodotto di <strong>Whattadata</strong>, spin-off
              dell&apos; Università degli Studi di Milano-Bicocca, realizzato in
              collaborazione con l&apos;
              <strong>Università di Padova</strong>, l&apos;
              <strong>Università degli Studi di Milano-Bicocca</strong> e{" "}
              <strong>Aton IT</strong>.
            </p>

            <p className="mb-6 text-lg leading-relaxed">
              Un percorso di collaborazione che unisce <strong>ricerca</strong>{" "}
              e <strong>innovazione</strong> con l&apos;obiettivo di rendere la
              terapia più accessibile ed efficace
            </p>

            <div className="mt-8 flex flex-col items-center gap-10">
              <div className="flex justify-center">
                <LogoLink
                  href="https://whattadata.it/"
                  imgSrc="/images/whattadata.svg"
                  alt="Logo Whattadata"
                  width={200}
                  height={240}
                  setShowCursor={setShowCursor}
                  className="h-28 md:h-32 lg:h-36"
                />
              </div>

              <div className="flex justify-center gap-8 md:gap-16">
                <LogoLink
                  href="https://www.unipd.it/"
                  imgSrc="/images/Logo_Università_Padova.png"
                  alt="Logo Università di Padova"
                  width={140}
                  height={140}
                  setShowCursor={setShowCursor}
                  className="h-16 md:h-20 lg:h-24"
                />
                <LogoLink
                  href="https://www.unimib.it/"
                  imgSrc="/images/logo_bicocca.svg"
                  alt="Logo Università degli Studi di Milano-Bicocca"
                  width={130}
                  height={140}
                  setShowCursor={setShowCursor}
                  className="h-16 md:h-20 lg:h-24"
                />
                <LogoLink
                  href="#"
                  imgSrc="/images/logo-aton.webp"
                  alt="Logo Aton"
                  width={140}
                  height={140}
                  setShowCursor={setShowCursor}
                  className="h-16 md:h-20 lg:h-24"
                />
              </div>
            </div>

            {showCursor && (
              <div
                className="bg-primary text-md align-center pointer-events-none fixed z-50 flex items-center gap-2 rounded-md px-2 py-2 text-white shadow-lg"
                style={{
                  top: cursorPos.y,
                  left: cursorPos.x - 30,
                }}
              >
                <ExternalLink size={24} className="h-full" />
              </div>
            )}
          </div>
        </section>
      )}
    </InView>
  );
};

const LogoLink = ({
  href,
  imgSrc,
  alt,
  width,
  height,
  setShowCursor,
  className = "",
}: {
  href: string;
  imgSrc: string;
  alt: string;
  width: number;
  height: number;
  setShowCursor: (show: boolean) => void;
  className?: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    onMouseEnter={() => setShowCursor(true)}
    onMouseLeave={() => setShowCursor(false)}
    className="relative w-auto cursor-none"
  >
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={`object-contain ${className}`}
    />
  </a>
);
