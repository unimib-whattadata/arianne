import '@/styles/globals.css';

import { cookies } from 'next/headers';
import React from 'react';

import { Toaster } from '@/components/ui/sonner';
import { TRPCReactProvider } from '@/trpc/react';
import { createClient } from '@arianne/supabase/server';
import { api } from '@/trpc/server';
import { redirect } from 'next/navigation';
import { env } from '@/env.mjs';
import { Poppins } from 'next/font/google';
import { cn } from '@/utils/cn';
import { Navbar } from '@/features/terapeuti/onboarding/navbar';

const poppins = Poppins({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin-ext'],
  variable: '--ff-poppins',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If there is no user, redirect to login
  const supabase = await createClient(cookies());
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return redirect('/auth/login');
  }

  // If the user is not a therapist, redirect to the patient app
  const role = await api.profiles.role();
  if (!role || role !== 'therapist') {
    return redirect(env.NEXT_PUBLIC_PATIENT_URL);
  }

  const profile = await api.profiles.get();
  if (profile?.completedOnboarding) {
    return redirect('/');
  }

  return (
    <html lang="it" className={cn('scroll-smooth', poppins.variable)}>
      <body>
        <TRPCReactProvider>
          <Navbar />
          {children}

          <Toaster richColors position="bottom-right" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
