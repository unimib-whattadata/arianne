import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="p-4 pt-0">
      <h1 className="mb-3 text-2xl font-semibold">Impostazioni</h1>
      <div className="flex w-full flex-col gap-4">
        <Link href="/impostazioni/account">
          <Button
            variant="ghost"
            className="h-full w-full justify-between bg-white p-4 text-base"
          >
            <p>Account</p>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </Link>
        <Link href="/impostazioni/modifica-password">
          <Button
            variant="ghost"
            className="h-full w-full justify-between bg-white p-4 text-base"
          >
            <p>Modifica Password</p>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </Link>
        <Link href="/impostazioni/notifiche">
          <Button
            variant="ghost"
            className="h-full w-full justify-between bg-white p-4 text-base"
          >
            <p>Preferenze e notifiche</p>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
