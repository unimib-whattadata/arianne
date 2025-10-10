'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Calendar1Icon } from 'lucide-react';
import { useState } from 'react';
import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import format from 'date-fns/format';
import { it } from 'date-fns/locale';

import { useTRPC } from '@/trpc/react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/utils/cn';
import type { FormValues } from '@arianne/db/schemas/medical-records';
import { ProfileSchema } from '@arianne/db/schemas/medical-records';

export default function ProfilePage() {
  const [edit, setEdit] = useState(false);
  const queryClient = useQueryClient();

  const api = useTRPC();
  const { data: patient } = useQuery(api.patients.get.queryOptions());

  const form = useForm<FormValues>({
    resolver: zodResolver(ProfileSchema),
  });
  const { mutateAsync } = useMutation(
    api.medicalRecords.update.mutationOptions({
      onSuccess: () => {
        toast.success('Cartella clinica aggiornata');
        setEdit(false);
      },
      onError: (error) => {
        toast.error("Errore durante l'aggiornamento della cartella clinica");
        console.error(error);
      },
      onSettled: async () => {
        await queryClient.invalidateQueries(
          api.patients.findUnique.queryFilter(),
        );
        await queryClient.invalidateQueries(
          api.therapists.findUnique.queryFilter(),
        );
      },
    }),
  );

  const submitHandler: SubmitHandler<FormValues> = async (data) => {
    try {
      if (!patient?.medicalRecords?.id) {
        toast.error('Dati paziente non trovati');
        return;
      }

      const updateData = {
        firstName: data.user.firstName ?? patient.profile.firstName,
        lastName: data.user.lastName ?? patient.profile.lastName,
        birthDate: data.user.birthDate ?? patient.medicalRecords.birthDate,
        birthPlace: data.user.birthPlace ?? patient.medicalRecords.birthPlace,
        gender: data.user.gender ?? patient.medicalRecords.gender,
      };

      await mutateAsync({
        where: { id: patient.medicalRecords.id },
        data: updateData,
      });

      toast.success('Dati aggiornati con successo.');
    } catch (error) {
      console.error(error);
      toast.error('Errore durante il salvataggio.');
    }
  };

  const errorHandler: SubmitErrorHandler<FormValues> = (error) => {
    console.error(error);
  };

  if (!patient?.id) return <p>Loading...</p>;

  if (edit) {
    return (
      <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
        <div className="bg-background sticky top-0 z-10 pb-3">
          <h1 className="text-xl font-semibold">Cartella Clinica</h1>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              className="text-secondary hover:bg-secondary/10 hover:text-secondary"
              onClick={() => setEdit(false)}
            >
              Annulla
            </Button>
            <Button
              className="ml-2"
              onClick={form.handleSubmit(submitHandler, errorHandler)}
              variant="secondary"
            >
              Salva
            </Button>
          </div>
        </div>
        <Form {...form}>
          <form className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Card className="bg-white">
                <CardHeader className="font-semibold">
                  Dati anagrafici
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="user.firstName"
                    defaultValue={patient.profile.firstName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nome
                          <span className="text-primary ml-2">
                            Obbligatorio
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="user.lastName"
                    defaultValue={patient.profile.lastName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Cognome
                          <span className="text-primary ml-2">
                            Obbligatorio
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Cognome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="user.birthDate"
                    defaultValue={patient.medicalRecords.birthDate}
                    render={({ field }) => (
                      <FormItem className="col-span-2 flex flex-col">
                        <FormLabel>Data di nascita</FormLabel>
                        <Popover>
                          <PopoverTrigger
                            asChild
                            className="ring-secondary hover:bg-secondary/10 hover:text-secondary focus:ring-secondary border-secondary"
                          >
                            <FormControl className="font-medium text-black">
                              <Button
                                type="button"
                                variant="outline"
                                className={cn(!field.value && '')}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP', {
                                    locale: it,
                                  })
                                ) : (
                                  <span>Seleziona la data di nascita</span>
                                )}
                                <Calendar1Icon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              captionLayout="dropdown-buttons"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="user.birthPlace"
                    defaultValue={patient.medicalRecords.birthPlace}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Luogo di nascita</FormLabel>
                        <FormControl>
                          <Input placeholder="Luogo di nascita" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="user.gender"
                    defaultValue={patient.medicalRecords.gender}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genere</FormLabel>
                        <FormControl>
                          <Input placeholder="Genere" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader className="font-semibold">Contatti</CardHeader>
                <CardContent className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="contacts.email"
                    defaultValue={patient.profile.email}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email
                          <span className="text-primary ml-2">
                            Obbligatorio
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contacts.phone"
                    defaultValue={patient.profile.phone ?? ''}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Numero di telefono
                          <span className="text-primary ml-2">
                            Obbligatorio
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Numero di telefono" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-3">
              <Card className="bg-white">
                <CardHeader className="font-semibold">Dati terapia</CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <p className="text-muted-foreground text-sm leading-none font-medium">
                      Nome terapeuta
                    </p>
                    <p>{patient.therapist?.profile.name || '-'} </p>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <p className="text-muted-foreground text-sm leading-none font-medium">
                      Orientamento terapeutico
                    </p>
                    <p> Richiamare campo orientamento terapeutico</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm leading-none font-medium">
                      Data inizio terapia
                    </p>
                    <p>
                      {patient.medicalRecords.takingChargeDate
                        ? format(
                            patient.medicalRecords.takingChargeDate,
                            'PPP',
                            {
                              locale: it,
                            },
                          )
                        : '-'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="bg-background sticky top-0 z-10 pb-3">
        <h1 className="text-xl font-semibold">Profilo</h1>
        <div className="flex justify-end">
          <Button
            className="ml-2"
            variant="secondary"
            onClick={() => setEdit(true)}
          >
            Modifica
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <Card className="bg-white">
            <CardHeader className="font-semibold">Dati anagrafici</CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Nome
                </p>
                <p>{patient.profile.firstName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Cognome
                </p>
                <p>{patient.profile.lastName}</p>
              </div>

              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Data di nascita
                </p>
                <p>
                  {patient.medicalRecords.birthDate
                    ? format(patient.medicalRecords.birthDate, 'PPP', {
                        locale: it,
                      })
                    : '-'}
                </p>
              </div>

              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Luogo di nascita
                </p>
                <p>{patient.medicalRecords.birthPlace || '-'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Genere
                </p>
                <p>{patient.medicalRecords.gender || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Codice fiscale
                </p>
                <p>Codice fiscale</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="font-semibold">Contatti</CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Email
                </p>
                <p>{patient.profile.email || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Numero di telefono
                </p>
                <p>{patient.profile.phone || '-'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <Card className="bg-white">
            <CardHeader className="font-semibold">Dati terapia</CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Nome terapeuta
                </p>
                <p>{patient.therapist?.profile.name || '-'} </p>
              </div>

              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Orientamento terapeutico
                </p>
                <p> Richiamare campo orientamento terapeutico</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Data inizio terapia
                </p>
                <p>
                  {patient.medicalRecords.takingChargeDate
                    ? format(patient.medicalRecords.takingChargeDate, 'PPP', {
                        locale: it,
                      })
                    : '-'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
