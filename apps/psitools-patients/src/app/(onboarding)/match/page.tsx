'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { UserRoundSearch } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';

import { TherapistCard } from '@/features/onboarding/match-card';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/react';

interface FormValues {
  therapistId: string | null;
}

export default function Match() {
  const api = useTRPC();
  const { data: matchList } = useQuery(
    api.therapists.getMatched.queryOptions(),
  );
  const lastThree = matchList ? matchList.slice(0, 3) : [];
  const isLoading = !matchList;

  const methods = useForm<FormValues>({
    defaultValues: { therapistId: null },
  });

  const { watch, setValue, handleSubmit } = methods;
  const selectedTherapistId = watch('therapistId');

  useEffect(() => {
    const saved = localStorage.getItem('selectedTherapist');
    if (saved) setValue('therapistId', saved);
  }, [setValue]);

  useEffect(() => {
    if (selectedTherapistId) {
      localStorage.setItem('selectedTherapist', selectedTherapistId);
    } else {
      localStorage.removeItem('selectedTherapist');
    }
  }, [selectedTherapistId]);

  const onSubmit = (data: FormValues) => {
    if (!data.therapistId) {
      toast.error('Prima di passare al prossimo step seleziona un terapeuta');
      return;
    }
    window.location.href = '/fiscal';
  };

  return (
    <main className="mt-8 flex min-h-screen flex-col items-center justify-center gap-10 p-4 md:mt-0 md:p-10 md:py-36">
      <Toaster position="top-center" richColors />

      <div className="mx-auto flex max-w-3xl flex-col items-start">
        <UserRoundSearch className="text-primary mb-4 h-10 w-10 sm:h-12 sm:w-12" />
        <h1 className="mb-4 text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-4xl">
          Ecco i terapeuti selezionati per te
        </h1>
        <h2 className="mb-2 text-lg font-medium text-slate-900 sm:mb-4 sm:text-xl lg:text-2xl">
          In base alle tue risposte, pensiamo che questi professionisti
          potrebbero essere perfetti per te
        </h2>
        <p className="text-sm leading-relaxed text-slate-700 sm:mb-8 sm:text-base md:mb-6">
          I costi possono variare in base all’esperienza, disponibilità serale o
          specializzazioni del terapeuta. Il prezzo è sempre visibile prima
          della prenotazione.
        </p>
      </div>

      <FormProvider {...methods}>
        <form
          className="mx-auto flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {isLoading && <p>Caricamento...</p>}
          {!isLoading &&
            lastThree.map((therapist) => (
              <TherapistCard
                key={therapist.id}
                therapist={therapist}
                selected={selectedTherapistId === therapist.id}
                onSelect={(id, selected) =>
                  setValue('therapistId', selected ? id : null)
                }
              />
            ))}

          <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1"
              asChild
            >
              <Link href="/onboarding" className="w-full text-center">
                Torna alla lista degli step
              </Link>
            </Button>
            <Button
              type="submit"
              variant="secondary"
              className="w-full sm:flex-1"
            >
              Passa al prossimo step
            </Button>
          </div>
        </form>
      </FormProvider>
    </main>
  );
}
