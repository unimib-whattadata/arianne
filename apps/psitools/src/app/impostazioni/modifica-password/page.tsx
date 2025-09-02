'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2, MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
// import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTRPC } from '@/trpc/react';

export default function PasswordPage() {
  const api = useTRPC();
  const { data } = useQuery(api.therapists.findUnique.queryOptions());
  const [submitting, setSubmitting] = useState(false);

  const restPassword = /* async */ () => {
    if (submitting || !data?.user) return;
    setSubmitting(true);
    // TODO: modifica password
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen p-4 pt-0">
      <h1 className="mb-3 text-2xl font-semibold">Reimposta Password</h1>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-sm">
          <p>
            Riceverai una mail per reimpostare la tua password all'indirizzo
            <strong> {data?.profile?.email}</strong>
          </p>
          <p>
            Se non ricevi la mail, controlla la cartella spam o riprova più
            tardi
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <Button
            disabled={submitting}
            className="w-full"
            onClick={restPassword}
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Invia Mail di Reset Password
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/impostazioni">
              <MoveLeft className="mr-2 h-4 w-4" />
              Torna alle impostazioni
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
