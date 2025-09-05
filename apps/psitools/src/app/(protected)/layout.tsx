import '@/styles/globals.css';

import { Poppins, Rubik } from 'next/font/google';
import { cookies } from 'next/headers';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { TRPCReactProvider } from '@/trpc/react';
import { createClient } from '@arianne/supabase/server';
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

  if (error || !data.user) {
    return redirect('/auth/login');
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
