'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileUp } from 'lucide-react';

export default function meditazione() {
  return (
    <div className="h-full-safe relative overflow-auto p-4 pt-0">
      <h1 className="mb-4 text-xl font-semibold">
        Ansia - Lezione 1: Combattere l’ansia con la meditazione
      </h1>
      <div className="my-6 flex justify-end">
        <Button variant="outline" size="sm" className="w-fit" asChild>
          <Link href="#">
            <FileUp className="h-4 w-4 text-current" />
          </Link>
        </Button>
      </div>
      <div className="rounded-[4px] bg-white p-8">
        <h3 className="text-base font-semibold">Cos’è l’ansia?</h3>
        <p className="mt-2">
          L’ansia può essere definita come la paura di qualcosa di futuro, non
          ancora presente. Si distingue dalla paura in cui l’elemento minaccioso
          è nel presente, proprio di fronte a noi. L’ansia è l’anticipazione
          apprensiva di un pericolo o di un evento negativo futuri, +
          accompagnata da sentimenti di malessere o da sintomi fisici di
          tensione. L’ansia quindi può essere definita come lo stato emotivo
          generato dalla percezione che qualcosa di negativo o minaccioso possa
          accadere in futuro.
        </p>
        <h3 className="mt-4 text-base font-semibold">Come si manifesta?</h3>
        <ul className="mt-2 list-inside list-disc">
          <li className="mb-4">
            L’ansia può essere di breve durata, quindi transitoria e legata a
            una specifica situazione. Si presenta con sensazioni di tensione e
            apprensione e dall’aumentata reattività del sistema nervoso
            autonomo, nello specifico il sistema simpatico, che prepara il corpo
            ad affrontare situazioni di pericolo. L’ansia può variare e
            fluttuare nel tempo. Ad esempio, può presentarsi prima o durante un
            evento o una prestazione importante, come un esame universitario o
            un colloquio di lavoro. Questo tipo di ansia si chiama ‘di stato’.
          </li>
          <li className="mb-4">
            L’ansia può essere anche una caratteristica individuale che si
            esprime nella tendenza a rispondere con aumentata ansia (di stato) a
            situazioni percepite come minacciose. Ad esempio, il fatto di
            sentirsi da sempre una persona ansiosa è una manifestazione
            dell’ansia di tratto.
          </li>
          <li className="mb-4">
            L’ansia può manifestarsi attraverso i pensieri negativi ripetitivi
            rivolti verso il futuro, con preoccupazione, e apprensione. Questa è
            la componente cognitiva dell’ansia.
          </li>
          <li className="mb-4">
            L’ansia può presentarsi anche a livello corporeo con una
            iperattivazione del Sistema Nervoso Autonomo Simpatico - ad esempio
            con aumentata sudorazione, tachicardia, tremori. Questa è la
            componente somatica (da soma = corpo) dell’ansia.
          </li>
        </ul>
      </div>
    </div>
  );
}
