import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="p-4 pt-0">
      <h1 className="mb-3 text-2xl font-semibold">Impostazioni</h1>
      <div className="flex w-full flex-col gap-4">
        <Link href="/impostazioni/modifica-password">
          <Button
            variant="ghost"
            className="hover:bg-secondary/20 hover:text-foreground h-full w-full justify-between bg-white p-4 text-base"
          >
            <p>Modifica password</p>
            <ChevronRight className="text-muted-foreground h-4 w-4" />
          </Button>
        </Link>
        <Link href="/impostazioni/notifiche">
          <Button
            variant="ghost"
            className="hover:bg-secondary/20 hover:text-foreground h-full w-full justify-between bg-white p-4 text-base"
          >
            <p>Preferenze e notifiche</p>
            <ChevronRight className="text-muted-foreground h-4 w-4" />
          </Button>
        </Link>
        <Link href="/impostazioni/pagamento">
          <Button
            variant="ghost"
            className="hover:bg-secondary/20 hover:text-foreground h-full w-full justify-between bg-white p-4 text-base"
          >
            <p>Metodi di pagamento</p>
            <ChevronRight className="text-muted-foreground h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
