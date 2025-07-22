import '@/styles/globals.css';

import { Poppins, Rubik } from 'next/font/google';
import { cookies, headers } from 'next/headers';

import { auth } from '@/auth/server';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { TRPCReactProvider } from '@/trpc/react';

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

export const iframeHeight = '800px';

export const description = 'A sidebar with a header and a search form.';

export default async function RootLayout({
  children,
  breadcrumbs,
  sidebar,
}: Readonly<{
  children: React.ReactNode;
  breadcrumbs: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  const _session = await auth.api.getSession({
    headers: await headers(),
  });

  // if (!session.user?.roles.includes('therapist')) {
  //   // Redirect to patient platform if the user is not a therapist
  //   // return redirect()
  // }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <html lang="it">
      <body className={`${rubik.variable} ${poppins.variable}`}>
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
          <Toaster richColors position="top-center" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
