import '@/styles/globals.css';

import { Poppins, Rubik } from 'next/font/google';
import { TRPCReactProvider } from '@/trpc/react';
import { Toaster } from 'sonner';

const rubik = Rubik({
  weight: ['500'],
  subsets: ['latin-ext'],
  variable: '--ff-rubik',
});

const poppins = Poppins({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin-ext'],
  variable: '--ff-poppins',
});

// eslint-disable-next-line @typescript-eslint/require-await
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${rubik.variable} ${poppins.variable}`}>
      <body>
        <TRPCReactProvider>
          {children}
          <Toaster richColors position="top-center" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
