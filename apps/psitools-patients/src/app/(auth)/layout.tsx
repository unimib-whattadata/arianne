import '@/styles/globals.css';

import { TRPCReactProvider } from '@/trpc/react';
import { Toaster } from 'sonner';
import { Poppins } from 'next/font/google';
import { cn } from '@/utils/cn';
import { createClient } from '@arianne/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const poppins = Poppins({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin-ext'],
  variable: '--ff-poppins',
});

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
    <html lang="it" className={cn('scroll-smooth', poppins.variable)}>
      <body>
        <TRPCReactProvider>
          {children}
          <Toaster richColors position="top-center" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
