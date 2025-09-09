import '@/styles/globals.css';

import { cookies } from 'next/headers';
import React from 'react';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { TRPCReactProvider } from '@/trpc/react';

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
