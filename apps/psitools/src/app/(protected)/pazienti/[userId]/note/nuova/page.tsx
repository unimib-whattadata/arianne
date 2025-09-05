'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';
import type { NoteCreate } from '@arianne/db/schema';
import { NoteCreateSchema } from '@arianne/db/schema';

export default function NuovaNotaPage() {
  const form = useForm<NoteCreate>({
    resolver: zodResolver(NoteCreateSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });
  const router = useRouter();
  const api = useTRPC();
  const queryClient = useQueryClient();
  const { patient } = usePatient();

  const { mutateAsync: createNote } = useMutation(
    api.notes.create.mutationOptions({
      onSuccess: async () => {
        toast.success('Nota creata con successo.');
        await queryClient.invalidateQueries(api.notes.findMany.queryFilter());
        form.reset();
        router.back();
      },
      onError: (error) => {
        console.error('Error creating note:', error);
        toast.error(
          'Si è verificato un errore durante la creazione della nota. Riprova.',
        );
      },
    }),
  );

  if (!patient?.id) return null;

  const submitHandler: SubmitHandler<NoteCreate> = async (data) => {
    await createNote({
      ...data,
      patientId: patient.id,
    });
  };

  const submitErrorHandler: SubmitErrorHandler<NoteCreate> = (error) => {
    console.error('Error creating note:', error);
  };

  return (
    <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="bg-background sticky top-0 z-10 pb-3">
        <h1 className="text-xl font-semibold">Note</h1>
        <div className="flex items-center justify-end gap-2">
          <Button variant="link" onClick={() => router.back()}>
            Annulla
          </Button>
          <Button
            onClick={form.handleSubmit(submitHandler, submitErrorHandler)}
          >
            Salva
          </Button>
        </div>
      </div>
      <Card className="p-4">
        <Form {...form}>
          <form className="space-y-4">
            <div className="grid grid-cols-[1fr_auto] grid-rows-[auto_1fr] items-center gap-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="row-start-1 row-end-3 grid grid-cols-subgrid grid-rows-subgrid space-y-0">
                    <FormLabel className="row-start-1 row-end-2">
                      Titolo
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Titolo"
                        {...field}
                        className="row-start-2 row-end-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pinned"
                render={({ field }) => (
                  <FormItem className="row-start-1 row-end-3 grid grid-cols-subgrid grid-rows-subgrid">
                    <FormControl>
                      <Toggle
                        aria-label="Evidenzia"
                        variant="outline"
                        pressed={field.value}
                        onPressedChange={field.onChange}
                        className="row-start-2 row-end-3"
                      >
                        <Star />
                        In evidenza
                      </Toggle>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenuto</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Inserisci il contenuto della nota..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </Card>
    </div>
  );
}
