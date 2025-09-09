import "~/styles/globals.css";

import { type Metadata } from "next";
import { Poppins } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
  title: "Arianne",
  description:
    "La piattaforma digitale che unisce ricerca clinica e innovazione tecnologica per rendere la psicoterapia online efficace, accessibile e centrata sui bisogni di pazienti e terapeuti",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins-sans",
});

export default function RootLayout({
  children,
  header,
  footer,
}: Readonly<{
  header: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth", poppins.variable)}>
      <body>
        <TRPCReactProvider>
          {header}
          {children}
          {footer}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
