"use client";

import { UserRound, Wallet, ReceiptText, BookHeart } from "lucide-react";
import { CardOption } from "~/features/terapeuti/onboarding/card";
import type { CardOptionType } from "~/features/terapeuti/onboarding/card";

const OPTIONS: CardOptionType[] = [
  {
    value: "personal",
    title: "Dati anagrafici e qualifiche professionali",
    icon: <UserRound className="h-6 w-6" />,
    route: "/terapeuti/onboarding/personal",
  },
  {
    value: "experience",
    title: "Esperienza clinica e approccio terapeutico",
    icon: <BookHeart className="h-6 w-6" />,
    route: "/terapeuti/onboarding/experience",
  },
  {
    value: "fiscal",
    title: "Dati Fiscali e disponibilità",
    icon: <Wallet className="h-6 w-6" />,
    route: "/terapeuti/onboarding/fiscal",
  },
  {
    value: "privacy",
    title: "Accordi, privacy e accesso alla piattaforma",
    icon: <ReceiptText className="h-6 w-6" />,
    route: "/terapeuti/onboarding/privacy",
  },
];

const COMPLETED = ["privacy"];

export default function Landing() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-10 py-36">
      <div className="w-full max-w-3xl">
        <h1 className="text-h1 text-center font-bold text-slate-900">
          Ciao Chiara!
        </h1>
        <h2 className="mt-2 text-center text-xl font-medium text-slate-900">
          Completa gli ultimi step per attivare il tuo profilo
        </h2>
      </div>

      <div className="flex w-full max-w-3xl flex-col gap-4">
        {OPTIONS.map((option) => (
          <CardOption
            key={option.value}
            option={option}
            completed={COMPLETED.includes(option.value)}
          />
        ))}
      </div>
    </main>
  );
}
