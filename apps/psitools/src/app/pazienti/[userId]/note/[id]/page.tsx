'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import type { UpdateNoteType } from '@/features/patient/notes/schema';
import { updateNoteSchema } from '@/features/patient/notes/schema';
import { useTRPC } from '@/trpc/react';
import { cn } from '@/utils/cn';

export default function Nota() {
  const { id } = useParams<{ id: string }>();
  const [edit, setEdit] = useState(false);

  const router = useRouter();

  const api = useTRPC();
  const queryClient = useQueryClient();
  const { data: note } = useQuery(
    api.note.findUnique.queryOptions({ id }, { enabled: !!id }),
  );

  const form = useForm<UpdateNoteType>({
    resolver: zodResolver(updateNoteSchema),
    defaultValues: async () => {
      const asyncNote = await queryClient.fetchQuery(
        api.note.findUnique.queryOptions({ id }),
      );
      return {
        pinned: asyncNote.pinned,
        title: asyncNote.title,
        content: asyncNote.content,
      };
    },
  });

  const { mutateAsync: deleteNote } = useMutation(
    api.note.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(api.note.findMany.queryFilter());
        toast.success('Nota eliminata con successo.');
        router.back();
      },
      onError: (error) => {
        console.error('Error deleting note:', error);
      },
    }),
  );

  const { mutateAsync: updateNote } = useMutation(
    api.note.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(api.note.findUnique.queryFilter());
        toast.success('Nota aggiornata con successo.');
        setEdit(false);
      },
      onError: (error) => {
        console.error('Error updating note:', error);
      },
    }),
  );

  if (!note) return null;

  const handleUpdate: SubmitHandler<UpdateNoteType> = async (data) => {
    await updateNote({
      where: { id: note.id },
      data,
    });
  };

  const submitErrorHandler: SubmitErrorHandler<UpdateNoteType> = (error) => {
    console.error('Error updating note:', error);
    toast.error(
      "Si è verificato un errore durante l'aggiornamento della nota.",
    );
  };

  const handleDelete = async () => {
    await deleteNote({ where: { id: note.id } });
  };

  if (edit) {
    return (
      <div className="relative grid h-full-safe grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
        <div className="sticky top-0 z-10 bg-background pb-3">
          <h1 className="text-xl font-semibold">Note</h1>
          <div className="flex items-center justify-end gap-2">
            <Button variant="link" onClick={() => setEdit(false)}>
              Annulla
            </Button>
            <Button
              onClick={form.handleSubmit(handleUpdate, submitErrorHandler)}
            >
              Salva
            </Button>
          </div>
        </div>
        <Card className="space-y-4 p-4">
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="link" className="px-0 text-destructive">
                Elimina nota
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sei assolutamente sicuro/a?</AlertDialogTitle>
                <AlertDialogDescription>
                  Verrà eliminata definitivamente la nota e non sarà più
                  possibile recuperarla.
                  <br />
                  <strong>Questa azione non può essere annullata.</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-row items-center justify-end gap-2 space-y-0">
                <AlertDialogCancel className="text-primary">
                  Annulla
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  variant="destructive"
                  className=""
                >
                  Elimina la nota
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative grid h-full-safe grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="sticky top-0 z-10 bg-background pb-3">
        <h1 className="text-xl font-semibold">Note</h1>
        <div className="flex items-center justify-end gap-2">
          <Button variant="link" onClick={() => router.back()}>
            Indietro
          </Button>
          <Button onClick={() => setEdit(true)}>Modifica</Button>
        </div>
      </div>
      <Card className="grid gap-4 p-4">
        <div className="grid grid-cols-[1fr_auto] grid-rows-[auto_1fr] items-center gap-2">
          <p className="col-span-2 text-sm font-medium leading-none text-muted-foreground">
            Titolo
          </p>
          <p>{note.title}</p>
          <p className="col-start-2 col-end-3 row-start-2 row-end-3 flex items-center gap-2">
            <Star
              className={cn(
                'h-4 w-4',
                note.pinned ? 'fill-primary text-primary' : '',
              )}
            />
            In evidenza
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium leading-none text-muted-foreground">
            Contenuto
          </p>
          <p dangerouslySetInnerHTML={{ __html: note.content }} />
        </div>
      </Card>
    </div>
  );
}
