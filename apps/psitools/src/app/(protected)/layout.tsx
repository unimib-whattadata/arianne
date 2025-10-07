import '@/styles/globals.css';

import { Poppins, Rubik } from 'next/font/google';
import { cookies } from 'next/headers';

import type { Metadata } from 'next';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { TRPCReactProvider } from '@/trpc/react';
import { createClient } from '@arianne/supabase/server';
import { redirect } from 'next/navigation';
import { api } from '@/trpc/server';
import { env } from '@/env.mjs';

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
  breadcrumbs,
  sidebar,
}: Readonly<{
  children: React.ReactNode;
  breadcrumbs: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  const supabase = await createClient(cookies());
  const { data, error } = await supabase.auth.getUser();
  const role = await api.profiles.role();

  // If there is no user, redirect to login
  if (error || !data.user) {
    return redirect('/auth/login');
  }

  // If the user is not a therapist, redirect to the patient app
  if (!role || role !== 'therapist') {
    return redirect(env.NEXT_PUBLIC_PATIENT_URL);
  }

  // If the user has not completed onboarding, redirect to onboarding
  const profile = await api.profiles.get();
  if (!profile?.completedOnboarding) {
    redirect('/onboarding');
  }

  return (
    <html lang="it" className={`${rubik.variable} ${poppins.variable}`}>
      <body>
        <TRPCReactProvider>
          <SidebarProvider className="flex flex-col" defaultOpen={defaultOpen}>
            <div className="flex flex-1">
              {sidebar}
              <SidebarInset className="[--header-height:calc(--spacing(14))]">
                {breadcrumbs}
                {children}
              </SidebarInset>
            </div>
          </SidebarProvider>
          <Toaster richColors position="top-center" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
