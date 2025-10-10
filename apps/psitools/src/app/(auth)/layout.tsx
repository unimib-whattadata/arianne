import type { Metadata } from 'next';
import '@/styles/globals.css';

import { Poppins, Rubik } from 'next/font/google';
import { TRPCReactProvider } from '@/trpc/react';
import { Toaster } from 'sonner';
import { createClient } from '@arianne/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

export const metadata: Metadata = {
  title: 'Arianne',
  description:
    'Piattaforma per la gestione di studi di psicologia e psicoterapia',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient(cookies());
  const { data, error } = await supabase.auth.getUser();

  // If there is a user, redirect to the app
  if (data.user && !error) {
    return redirect('/');
  }

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
