import '@/styles/globals.css';

import { TRPCReactProvider } from '@/trpc/react';
import { Toaster } from 'sonner';
import { Poppins } from 'next/font/google';
import { cn } from '@/utils/cn';

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
