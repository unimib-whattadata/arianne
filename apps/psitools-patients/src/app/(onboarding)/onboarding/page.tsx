import { UserRound, Wallet, BookHeart, UserRoundSearch } from 'lucide-react';
import { CardOption } from '@/features/onboarding/card';
import type { CardOptionType } from '@/features//onboarding/card';
import { api } from '@/trpc/server';

const COMPLETED = [''];

export default async function OnboardingPage() {
  const patient = await api.patients.get();

  const OPTIONS: CardOptionType[] = [
    {
      value: 'personal',
      title: 'Dati anagrafici',
      text: 'Inserisci i tuoi dati',
      icon: <UserRound className="h-6 w-6" />,
      route: '/personal',
      completed: patient?.personalInfoAdded ?? false,
    },
    {
      value: 'questionnaire',
      title: 'Rispondi al questionario ',
      text: 'Qui puoi dirci di cosa hai bisogno ',

      icon: <BookHeart className="h-6 w-6" />,
      route: '/questionnaire',
    },
    {
      value: 'match',
      title: 'Seleziona il tuo terapeuta',
      text: 'Scegli tra quelli proposti il più adatto per te ',

      icon: <UserRoundSearch className="h-6 w-6" />,
      route: '/match',
    },
    {
      value: 'fiscal',
      title: 'Imposta il metodo di pagamento',
      text: 'Definisci i dati di fatturazione ',

      icon: <Wallet className="h-6 w-6" />,
      route: '/fiscal',
    },
  ];

  console.log('PATIENT', patient);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10">
      <div className="mt-8 flex w-full flex-1 flex-col gap-4 p-4 pt-12 md:mt-0 md:p-10 md:pt-28">
        <div className="w-full">
          <h1 className="md:text-h1 text-2xl font-semibold text-slate-900 md:text-center">
            Ciao Chiara!
          </h1>
          <h2 className="mt-2 text-lg font-medium text-slate-900 md:text-center md:text-xl">
            Completa gli ultimi step per attivare il tuo profilo
          </h2>
        </div>

        <div className="m-auto flex w-full max-w-3xl flex-col gap-4">
          {OPTIONS.map((option) => (
            <CardOption
              key={option.value}
              option={option}
              completed={option.completed} //{COMPLETED.includes(option.value)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
