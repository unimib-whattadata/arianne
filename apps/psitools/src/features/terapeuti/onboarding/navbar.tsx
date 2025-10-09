'use client';
import { Logo } from '@/components/logo';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { createClient } from '@arianne/supabase/client';
import { redirect } from 'next/navigation';
import { env } from '@/env.mjs';

const supabase = createClient();

export const Navbar = () => {
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error.message);
      return;
    }

    redirect(env.NEXT_PUBLIC_LANDING_URL);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full p-4">
      <div className="bg-background border-secondary container mx-auto rounded-full border px-4 py-2">
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/">
              <Logo className="text-primary h-6" />
            </Link>
          </div>
          <Button className="rounded-full">Esci</Button>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Logo className="text-primary h-6" />
            </Link>

            <Button className="rounded-full" onClick={() => signOut()}>
              Esci
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
