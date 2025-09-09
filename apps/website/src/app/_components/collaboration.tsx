"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowBigRight, ArrowRight, ExternalLink } from "lucide-react";

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

  return (
    <section
      id="collaboration"
      className="bg-secondary-light relative scroll-mt-8 py-12 lg:py-24"
    >
      <div className="container mx-auto grid max-w-prose px-4 text-center">
        <h2 className="text-h2 mb-4 font-medium">
          Un progetto costruito insieme
        </h2>

        <p>
          Arianne è il risultato di un lavoro condiviso tra l’
          <strong>Università di Padova</strong>, l’
          <strong>Università degli Studi di Milano-Bicocca</strong> e{" "}
          <strong>Whattadata</strong>.
        </p>
        <p>
          Un percorso di collaborazione che unisce <strong>ricerca</strong> e{" "}
          <strong>innovazione</strong> con l’obiettivo di rendere la terapia più
          accessibile ed efficace.
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-16">
        <LogoLink
          href="https://www.unipd.it/"
          imgSrc="/images/Logo_Università_Padova.png"
          alt="Logo Università di Padova"
          width={180}
          height={180}
          setShowCursor={setShowCursor}
        />
        <LogoLink
          href="https://www.unimib.it/"
          imgSrc="/images/logo_bicocca.svg"
          alt="Logo Università degli Studi di Milano-Bicocca"
          width={167}
          height={180}
          setShowCursor={setShowCursor}
        />
        <LogoLink
          href="https://whattadata.it/"
          imgSrc="/images/whattadata.svg"
          alt="Logo Whattadata"
          width={148}
          height={180}
          setShowCursor={setShowCursor}
        />
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
    </section>
  );
};

const LogoLink = ({
  href,
  imgSrc,
  alt,
  width,
  height,
  setShowCursor,
}: {
  href: string;
  imgSrc: string;
  alt: string;
  width: number;
  height: number;
  setShowCursor: (show: boolean) => void;
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
      className="h-16 object-contain md:h-20 lg:h-auto"
    />
  </a>
);
