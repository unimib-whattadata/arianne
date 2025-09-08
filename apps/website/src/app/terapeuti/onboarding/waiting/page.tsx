import Link from "next/link";
import { Button } from "~/components/ui/button";

import { Users } from "lucide-react";

export default function Waiting() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="flex flex-col">
        <Users className="text-primary h-10 w-10" />

        <h1 className="text-h1 text-left text-slate-900">
          Grazie per la tua candidatura!
        </h1>
        <p className="mt-8 text-left leading-relaxed text-slate-900">
          Il nostro team la revisionerà al più presto. <br />
          Se il tuo profilo risulterà idoneo, ti contatteremo per proseguire con
          i prossimi step del processo di registrazione.
        </p>
        <div className="mt-2 flex gap-2">
          <Button variant="secondary">
            <Link href="/terapeuti/onboarding">
              Ritorna alla tua candidatura
            </Link>
          </Button>
          <Button variant="secondary">
            <Link href="/terapeuti/onboarding/landing">Next</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
