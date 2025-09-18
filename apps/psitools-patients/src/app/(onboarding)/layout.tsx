import '@/styles/globals.css';

import { cookies } from 'next/headers';
import React from 'react';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { TRPCReactProvider } from '@/trpc/react';
import { createClient } from '@arianne/supabase/server';
import { api } from '@/trpc/server';
import { redirect } from 'next/navigation';
import { env } from '@/env.mjs';

export default async function RootLayout({
  children,
  sidebar,
  breadcrumbs,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  breadcrumbs: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  // If there is no user, redirect to login
  const supabase = await createClient(cookies());
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return redirect('/auth/login');
  }

  // If the user is not a patient, redirect to the therapist app
  const role = await api.profiles.role();
  if (!role || role !== 'patient') {
    return redirect(env.NEXT_PUBLIC_THERAPIST_URL);
  }

  const profile = await api.profiles.get();
  if (profile?.completedOnboarding) {
    return redirect('/');
  }

  return (
    <html lang="it">
      <body>
        <TRPCReactProvider>
          <SidebarProvider className="flex flex-col" defaultOpen={defaultOpen}>
            <div className="flex flex-1">
              {sidebar}
              <SidebarInset className="[--header-height:calc(theme(spacing.14))]">
                {breadcrumbs}
                {children}
              </SidebarInset>
            </div>
          </SidebarProvider>
          <Toaster richColors position="top-right" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
