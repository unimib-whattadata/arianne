'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import type { FormValues } from '@/features/questionnaires/gaf-sofas/item';
import { Item } from '@/features/questionnaires/gaf-sofas/item';
import { useTRPC } from '@/trpc/react';
import type { TView } from '@/types/view-types';
import { cn } from '@/utils/cn';

const TICKS = Array.from({ length: 101 }, (_, i) => i);

export default function GafSofasPage() {
  const { view } = useParams<{ view: TView }>();
  const [_, idTest] = view;

  const api = useTRPC();

  const {
    data: administration,
    isLoading,
    isFetching,
  } = useQuery(
    api.administration.findUnique.queryOptions(
      {
        where: { id: idTest },
      },
      {
        enabled: !!idTest,
        select: (data) => data.administration,
      },
    ),
  );

  const form = useForm<FormValues>();

  if (!administration || isLoading || isFetching) return null;

  const response = (administration?.records as FormValues).response;

  // TODO: Test if response is returned as expected and if default value is set correctly

  return (
    <div className="grid h-[calc(100dvh-(--spacing(6))-(--spacing(32)))] grid-rows-[auto_1fr_auto]">
      <Form {...form}>
        <header className="sticky top-0 mx-auto max-w-prose pb-3">
          <h1 className="font-h1 leading-tight">
            Scala per la Valutazione Globale del Funzionamento (VGF)
          </h1>
        </header>
        <div className="overflow-y-auto pb-8">
          <form className="mx-auto max-w-prose space-y-6">
            <section className="pb-4">
              <header className="sticky top-0 z-10 bg-gray-10 pb-3">
                <p className="mb-4 rounded-md bg-white p-4">
                  Considerare il funzionamento psicologico, sociale e lavorativo
                  nell&apos;ambito di un ipotetico continuum salute-malattia
                  mentale. Non includere le menomazioni del funzionamento dovute
                  a limitazioni fisiche (o ambientali).{' '}
                  <span className="text-sm">
                    Nota: usare codici intermedi, ove necessario, per es. 45,
                    68, 72. .
                  </span>
                </p>
                <p className="font-h3 absolute -right-28 top-80 z-20 rotate-90">
                  (sola visualizzazione)
                </p>
                <FormField
                  control={form.control}
                  defaultValue={response.value}
                  name="response.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-primary">
                        Codice
                      </FormLabel>
                      <FormControl>
                        <div className="relative pb-5 pt-12">
                          <div className="absolute flex h-12 w-full -translate-y-5 items-center justify-between px-4">
                            {TICKS.map((tick) => (
                              <div
                                key={tick}
                                className={cn(
                                  'relative h-10 w-px bg-space-gray',
                                  tick % 10 === 0 ? 'h-12' : 'h-6',
                                )}
                              >
                                {tick % 10 === 0 && (
                                  <span className="absolute -translate-x-1/2 -translate-y-full">
                                    {tick}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                          <Slider
                            value={field.value}
                            onValueChange={field.onChange}
                            max={100}
                            step={1}
                            disabled
                            className="rounded-full"
                            thumbClassName="h-8 w-8 grid place-items-center border-4 border-primary text-primary"
                          >
                            <span className="text-sm font-bold">
                              {field.value[0]}
                            </span>
                          </Slider>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </header>
              <Item value={response.value} />
            </section>
          </form>
        </div>
      </Form>
    </div>
  );
}
