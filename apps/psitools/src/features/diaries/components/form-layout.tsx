'use client';

import type { diariesTypeEnum } from '@arianne/db/schema';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import type { FieldValues, SubmitHandler } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { useSteps } from '@/features/diaries/context/step-context';
import { useTRPC } from '@/trpc/react';
import { debounce } from '@/utils/debounce';

interface FormLayoutProps {
  children: React.ReactNode;
  type: (typeof diariesTypeEnum.enumValues)[number];
  diaryId: string;
}

enum Title {
  food = 'Diario alimentare',
  cognitive_behavioral = 'Diario cognitivo-comportamentale',
  sleep_morning = 'Diario del sonno (mattina)',
  sleep_evening = 'Diario del sonno (sera)',
}

export function FormLayout<T extends FieldValues>(props: FormLayoutProps) {
  const api = useTRPC();
  const searchParams = useSearchParams();

  const form = useFormContext<T>();

  const isInNewTab = searchParams.get('hideUI') === 'true';

  // Mutation separata per l'auto-save
  const autoSaveMutation = useMutation(
    api.diaries.update.mutationOptions({
      onSuccess: () => {
        console.log('Auto-save completato');
      },
      onError: (error) => {
        console.error("Errore nell'auto-save", error);
      },
    }),
  );

  const finalSaveMutation = useMutation(
    api.diaries.update.mutationOptions({
      onSuccess: () => {
        console.log('Diario salvato con successo');
      },
      onError: (error) => {
        console.error('Errore nel salvataggio finale', error);
      },
    }),
  );

  const autoSaveData = debounce((data: T) => {
    autoSaveMutation.mutate({ id: props.diaryId, content: data });
  }, 1000);

  useEffect(() => {
    const { subscribe } = form;

    const subscription = subscribe({
      formState: {
        values: true,
      },
      callback: (data) => {
        if (!data) return;
        void autoSaveData(data.values);
      },
    });

    return () => subscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { currentStep, handleNext, handleBack, steps } = useSteps();

  const openInNewTab = () => {
    if (!props.diaryId) return;

    const currentUrl = window.location.href;

    const newUrl = new URL(currentUrl);

    newUrl.searchParams.set('hideUI', 'true');

    window.open(newUrl.toString(), '_blank');
  };

  const handleSave: SubmitHandler<T> = async (data) => {
    await finalSaveMutation.mutateAsync({
      id: props.diaryId,
      content: data,
      state: true,
    });

    handleNext();
  };

  const bar = useRef<HTMLDivElement>(null);

  const isPenultimateStep = currentStep === steps - 1;

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div>
          {currentStep === 1 ? null : (
            <Button onClick={handleBack} variant="outline">
              Indietro
            </Button>
          )}
        </div>

        <div>
          {isPenultimateStep ? (
            <Button
              onClick={form.handleSubmit(handleSave)}
              disabled={finalSaveMutation.isPending}
            >
              {finalSaveMutation.isPending ? 'Salvando...' : 'Salva'}
            </Button>
          ) : currentStep < steps - 1 ? (
            <div className="flex gap-2">
              {!isInNewTab && (
                <Button
                  variant="outline"
                  onClick={openInNewTab}
                  disabled={!props.diaryId}
                >
                  Apri in una nuova scheda
                </Button>
              )}
              <Button onClick={handleNext}>Continua</Button>
            </div>
          ) : null}
        </div>
      </div>
      <section className="grid h-[calc(100svh-var(--header-height))] grid-rows-[auto_1fr_auto]">
        <header className="grid gap-2 pb-4">
          <div className="px-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xs">Nuova Compilazione</h2>
                  <h2 className="text-lg font-semibold">
                    {Title[String(props.type) as keyof typeof Title]}
                  </h2>
                </div>
              </div>
            </nav>

            <div
              ref={bar}
              className="bg-card relative mt-2 h-2 w-full rounded-full"
            >
              <div
                style={{ width: `${(currentStep / steps) * 100}%` }}
                suppressHydrationWarning
                className="bg-primary absolute top-0 left-0 h-full rounded-full transition-all"
              />
            </div>
          </div>
        </header>

        <div className="px-4">{props.children}</div>
      </section>
    </>
  );
}

export function getDefaultsFromSchema<Schema extends z.AnyZodObject>(
  schema: Schema,
) {
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault)
        return [key, value._def.defaultValue()];
      return [key, ''];
    }),
  );
}
