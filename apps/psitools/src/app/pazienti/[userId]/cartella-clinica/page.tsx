'use client';

import type { KeycloakUser, Session } from '@arianne/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import format from 'date-fns/format';
import { it } from 'date-fns/locale';
import { Calendar1Icon, Plus, Trash2, TriangleAlert } from 'lucide-react';
import { Fragment, useState } from 'react';
import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { authClient } from '@/auth/client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { StateBadge } from '@/features/patient/components/state-badge';
import type { FormValues } from '@/features/patient/medical-records/schema';
import { FormSchema } from '@/features/patient/medical-records/schema';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';
import { cn } from '@/utils/cn';

export default function CartellaClinica() {
  const api = useTRPC();
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState(false);

  const { mutateAsync } = useMutation(
    api.medicalRecord.update.mutationOptions({
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
          api.patient.findUnique.queryFilter(),
        );
        await queryClient.invalidateQueries(
          api.therapist.findUnique.queryFilter(),
        );
      },
    }),
  );

  const { patient, isLoading } = usePatient();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const {
    fields: fieldsCaregivers,
    append: appendCaregivers,
    remove: removeCaregivers,
  } = useFieldArray({
    control: form.control,
    name: 'medicalRecords.caregivers',
  });

  const {
    fields: fieldsTags,
    append: appendTags,
    remove: removeTags,
  } = useFieldArray({
    control: form.control,
    name: 'medicalRecords.tags',
  });

  const submintHandler: SubmitHandler<FormValues> = async (data) => {
    if (!patient?.user) {
      toast.error('Paziente non trovato. Ricarica la pagina e riprova.');
      return;
    }

    if (patient.user.accounts.length === 0) {
      return await mutateAsync({
        where: { patientId: patient?.id },
        data: {
          ...data.medicalRecords,
        },
      });
    }

    const user: Omit<
      KeycloakUser,
      'requiredActions' | 'enabled' | 'emailVerified'
    > = {
      id: patient.user.id,
      username: patient.user.username,
      email: data.user.email,
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      attributes: {
        phoneNumber: data.user.phone || '',
      },
      groups: patient.user.group,
    };

    const res = await authClient.keycloak.updateUser({
      user,
      accountId: patient.user.accounts[0].accountId,
    });

    if (res.error) {
      toast.error(res.error.message);
      return;
    }

    await mutateAsync({
      where: { patientId: patient?.id },
      data: {
        ...data.medicalRecords,
      },
    });
  };

  const errorHandler: SubmitErrorHandler<FormValues> = (error) => {
    console.error(error);
  };

  const addPatient = async (user: Session['user']) => {
    await authClient.keycloak.addPatient({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      groups: user.group,
      attributes: {
        phoneNumber: user.phone || '',
      },
      requiredActions: ['VERIFY_EMAIL', 'UPDATE_PASSWORD'],
      fetchOptions: {
        onError: (ctx) => {
          toast.error(
            `Errore durante l'aggiunta del paziente: ${ctx.error.message}`,
          );
        },
        onSuccess: async () => {
          toast.success('Paziente aggiunto con successo');
          await queryClient.invalidateQueries(
            api.patient.findUnique.queryFilter(),
          );
        },
      },
    });
  };

  const resetPassword = async (user: Partial<Session['user']>) => {
    if (!user.id || !user.username) {
      toast.error('Impossibile reimpostare la password: utente non trovato');
      return;
    }
    await authClient.keycloak.resetPassword({
      id: user.id,
      username: user.username,
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: async () => {
          toast.success(
            'Email per il reset della password inviata con successo, segui le istruzioni contenute al suo interno',
          );
          await queryClient.invalidateQueries(
            api.patient.findUnique.queryFilter(),
          );
        },
      },
    });
  };

  if (isLoading || !patient?.user?.id || !patient?.medicalRecord)
    return <p>Loading...</p>;

  if (edit) {
    return (
      <div className="relative grid h-full-safe grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
        <div className="sticky top-0 z-10 bg-background pb-3">
          <h1 className="text-xl font-semibold">Cartella Clinica</h1>
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => setEdit(false)}>
              Annulla
            </Button>
            <Button
              className="ml-2"
              onClick={form.handleSubmit(submintHandler, errorHandler)}
            >
              Salva
            </Button>
          </div>
        </div>
        <Form {...form}>
          <form className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Card>
                <CardHeader className="font-semibold">
                  Dati anamnestici
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="user.firstName"
                    defaultValue={patient.user.firstName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nome
                          <span className="ml-2 text-primary">
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
                    defaultValue={patient.user.lastName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Cognome
                          <span className="ml-2 text-primary">
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
                    name="medicalRecords.alias"
                    defaultValue={patient.medicalRecord.alias}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Nome d'elezione</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome d'elezione" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalRecords.birthDate"
                    defaultValue={patient.medicalRecord.birthDate ?? undefined}
                    render={({ field }) => (
                      <FormItem className="col-span-2 flex flex-col">
                        <FormLabel>Data di nascita</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                type="button"
                                variant="input"
                                className={cn(
                                  !field.value && 'text-muted-foreground',
                                )}
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
                    name="medicalRecords.birthPlace"
                    defaultValue={patient.medicalRecord.birthPlace}
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
                    name="medicalRecords.sex"
                    defaultValue={patient.medicalRecord.sex ?? undefined}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sesso</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona il sesso" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="M">Maschio</SelectItem>
                            <SelectItem value="F">Femmina</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalRecords.gender"
                    defaultValue={patient.medicalRecord.gender}
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

                  <FormField
                    control={form.control}
                    name="medicalRecords.pronoun"
                    defaultValue={patient.medicalRecord.pronoun}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Pronome</FormLabel>
                        <FormControl>
                          <Input placeholder="Pronome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalRecords.occupation"
                    defaultValue={patient.medicalRecord.occupation}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Professione</FormLabel>
                        <FormControl>
                          <Input placeholder="Occupazione" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalRecords.education"
                    defaultValue={patient.medicalRecord.education}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Istruzione</FormLabel>
                        <FormControl>
                          <Input placeholder="Istruzione" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalRecords.otherNotes"
                    defaultValue={patient.medicalRecord.otherNotes}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Note ulteriori</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Note" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="font-semibold">
                  Dati familiari
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="medicalRecords.motherName"
                    defaultValue={patient.medicalRecord.motherName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome madre</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome madre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalRecords.motherStatus"
                    defaultValue={
                      patient.medicalRecord.motherStatus ?? undefined
                    }
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stato madre</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona lo stato" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="alive">Viva</SelectItem>
                            <SelectItem value="dead">Mortale</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalRecords.patherName"
                    defaultValue={patient.medicalRecord.patherName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome padre</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome padre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalRecords.fatherStatus"
                    defaultValue={
                      patient.medicalRecord.fatherStatus ?? undefined
                    }
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stato padre</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona lo stato" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="alive">Vivo</SelectItem>
                            <SelectItem value="dead">Mortale</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalRecords.parentsNotes"
                    defaultValue={patient.medicalRecord.parentsNotes}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Note ulteriori</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Note" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="font-semibold">
                  Accompagnatore
                </CardHeader>
                <CardContent
                  className={cn(
                    'grid grid-cols-2 gap-3',
                    fieldsCaregivers.length === 0 && 'p-0',
                  )}
                >
                  {fieldsCaregivers.length > 0 && (
                    <>
                      <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Nome
                        <span className="ml-2 text-primary">Obbligatorio</span>
                      </p>
                      <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Parentela
                        <span className="ml-2 text-primary">Obbligatorio</span>
                      </p>
                    </>
                  )}
                  {fieldsCaregivers.map((field, index) => (
                    <Fragment key={field.id}>
                      <FormField
                        control={form.control}
                        defaultValue={
                          (
                            patient.medicalRecord
                              ?.caregivers as PrismaJson.CaregiverType[]
                          )?.[index]?.name ?? ''
                        }
                        name={`medicalRecords.caregivers.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Nome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`medicalRecords.caregivers.${index}.kinship`}
                        defaultValue={
                          (
                            patient.medicalRecord
                              ?.caregivers as PrismaJson.CaregiverType[]
                          )?.[index]?.kinship ?? undefined
                        }
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleziona la parentela" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[
                                    'Madre',
                                    'Padre',
                                    'Fratello',
                                    'Sorella',
                                    'Altro',
                                  ].map((value) => (
                                    <SelectItem key={value} value={value}>
                                      {value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                type="button"
                                onClick={() => removeCaregivers(index)}
                                variant="ghost"
                                className="text-destructive"
                              >
                                <Trash2 />
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Fragment>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    type="button"
                    variant="link"
                    className="w-auto p-0"
                    onClick={() =>
                      appendCaregivers({
                        name: '',
                        kinship: 'Altro',
                      })
                    }
                  >
                    <Plus />
                    Aggiungi accompagnatore
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="font-semibold">Contatti</CardHeader>
                <CardContent className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="user.email"
                    defaultValue={patient.user.email}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email
                          <span className="ml-2 text-primary">
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
                    name="user.phone"
                    defaultValue={patient.user.phone ?? ''}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Numero di telefono
                          <span className="ml-2 text-primary">
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
              <Card>
                <CardHeader className="font-semibold">Dati clinici</CardHeader>
                <CardContent className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="medicalRecords.diagnosticHypothesis"
                    defaultValue={patient.medicalRecord.diagnosticHypothesis}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ipotesi diagnostica</FormLabel>
                        <FormControl>
                          <Input placeholder="Ipotesi diagnostica" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalRecords.simptoms"
                    defaultValue={patient.medicalRecord.simptoms}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sintomi</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Sintomi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalRecords.reason"
                    defaultValue={patient.medicalRecord.reason}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motivo della presa in carico</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Motivo della presa in carico"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalRecords.previousInterventions"
                    defaultValue={patient.medicalRecord.previousInterventions}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interventi precedenti</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Interventi precedenti"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalRecords.clinicalDataNotes"
                    defaultValue={patient.medicalRecord.clinicalDataNotes}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note ulteriori</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Note" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalRecords.highRisk"
                    defaultValue={patient.medicalRecord.highRisk}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="mb-0">
                            Rischio elevato
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="font-semibold">Intervento</CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="medicalRecords.state"
                    defaultValue={patient.medicalRecord.state}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Stato</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona lo stato" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="incoming">In arrivo</SelectItem>
                            <SelectItem value="ongoing">In corso</SelectItem>
                            <SelectItem value="archived">Archiviato</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalRecords.goals"
                    defaultValue={patient.medicalRecord.goals}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Obiettivi</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Obiettivi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalRecords.therapeuticPlan"
                    defaultValue={patient.medicalRecord.therapeuticPlan}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Piano terapeutico</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Piano terapeutico"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalRecords.frequency"
                    defaultValue={patient.medicalRecord.frequency}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequenza</FormLabel>
                        <FormControl>
                          <Input placeholder="Frequenza" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalRecords.takingChargeDate"
                    defaultValue={
                      patient.medicalRecord.takingChargeDate ?? undefined
                    }
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data presa in carico</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                type="button"
                                variant="input"
                                className={cn(
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP', {
                                    locale: it,
                                  })
                                ) : (
                                  <span>Seleziona la data</span>
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
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="font-semibold">Tags</CardHeader>
                <CardContent
                  className={cn('grid gap-3', fieldsTags.length === 0 && 'p-0')}
                >
                  {fieldsTags.length > 0 && (
                    <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Tag
                      <span className="ml-2 text-primary">Obbligatorio</span>
                    </p>
                  )}
                  {fieldsTags.map((field, index) => (
                    <Fragment key={field.id}>
                      <FormField
                        control={form.control}
                        name={`medicalRecords.tags.${index}.text`}
                        defaultValue={
                          (
                            patient.medicalRecord?.tags as PrismaJson.TagType[]
                          )?.[index]?.text ?? ''
                        }
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input placeholder="Tag" {...field} />
                              </FormControl>
                              <Button
                                type="button"
                                onClick={() => removeTags(index)}
                                variant="ghost"
                                className="text-destructive"
                              >
                                <Trash2 />
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Fragment>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="link"
                    className="w-auto p-0"
                    onClick={() =>
                      appendTags({
                        text: '',
                      })
                    }
                  >
                    <Plus />
                    Aggiungi tag
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="font-semibold">
                  Account paziente
                </CardHeader>
                {patient.user.accounts.length > 0 ? (
                  <CardContent
                    className={cn(
                      'grid gap-3',
                      !(patient.user.accounts.length > 0) && 'p-0',
                    )}
                  >
                    <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Nome utente
                    </p>
                    <p>{patient.user.username}</p>
                    <Button
                      variant="link"
                      className="w-min justify-start p-0"
                      onClick={() =>
                        void resetPassword({
                          id: patient.user?.accounts[0].accountId,
                          username: patient.user?.username,
                        })
                      }
                    >
                      Reimposta password
                    </Button>
                  </CardContent>
                ) : (
                  <CardFooter>
                    <Button
                      variant="link"
                      className="w-auto p-0"
                      onClick={() => void addPatient(patient.user!)}
                    >
                      Crea account paziente
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="relative grid h-full-safe grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="sticky top-0 z-10 bg-background pb-3">
        <h1 className="text-xl font-semibold">Cartella Clinica</h1>
        <div className="flex justify-end">
          <Button className="ml-2" onClick={() => setEdit(true)}>
            Modifica
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader className="font-semibold">Dati anamnestici</CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Nome
                </p>
                <p>{patient.user.firstName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Cognome
                </p>
                <p>{patient.user.lastName}</p>
              </div>

              <div className="col-span-2 space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Nome d'elezione
                </p>
                <p>{patient.medicalRecord.alias || '-'}</p>
              </div>

              <div className="col-span-2 space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Data di nascita
                </p>
                <p>
                  {patient.medicalRecord.birthDate
                    ? format(patient.medicalRecord.birthDate, 'PPP', {
                        locale: it,
                      })
                    : '-'}
                </p>
              </div>

              <div className="col-span-2 space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Luogo di nascita
                </p>
                <p>{patient.medicalRecord.birthPlace || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Sesso
                </p>
                <p>{patient.medicalRecord.sex || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Genere
                </p>
                <p>{patient.medicalRecord.gender || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Pronome
                </p>
                <p>{patient.medicalRecord.pronoun || '-'}</p>
              </div>
              <div className="col-span-2 space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Professione
                </p>
                <p>{patient.medicalRecord.occupation || '-'}</p>
              </div>
              <div className="col-span-2 space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Istruzione
                </p>
                <p>{patient.medicalRecord.education || '-'}</p>
              </div>
              <div className="col-span-2 space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Note ulteriori
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: patient.medicalRecord.otherNotes || '-',
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="font-semibold">Dati familiari</CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Nome madre
                </p>
                <p>{patient.medicalRecord.motherName || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Stato madre
                </p>
                <p>{patient.medicalRecord.motherStatus || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Nome padre
                </p>
                <p>{patient.medicalRecord.patherName || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Stato padre
                </p>
                <p>{patient.medicalRecord.fatherStatus || '-'}</p>
              </div>
              <div className="col-span-2 space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Note ulteriori
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: patient.medicalRecord.parentsNotes || '-',
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="font-semibold">Accompagnatore</CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {patient.medicalRecord.caregivers.length > 0 ? (
                (
                  patient.medicalRecord.caregivers as PrismaJson.CaregiverType[]
                ).map((caregiver) => (
                  <Fragment key={caregiver.name}>
                    <div className="space-y-2">
                      <p className="text-sm font-medium leading-none text-muted-foreground">
                        Nome
                      </p>
                      <p>{caregiver.name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium leading-none text-muted-foreground">
                        Parentela
                      </p>
                      <p>{caregiver.kinship}</p>
                    </div>
                  </Fragment>
                ))
              ) : (
                <p className="text-sm font-medium leading-none">
                  Nessun accompagnatore selezionato
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="font-semibold">Contatti</CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Email
                </p>
                <p>{patient.user.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Numero di telefono
                </p>
                <p>{patient.user.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader className="font-semibold">Dati clinici</CardHeader>
            <CardContent className="grid gap-4">
              {patient.medicalRecord.highRisk && (
                <div className="flex items-center gap-2 rounded-md border border-[#e55934] bg-[#faded6] p-3 text-[#e55934]">
                  <TriangleAlert className="h-4 w-4" />
                  <span className="text-base font-medium">High Risk</span>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Ipotesi diagnostica
                </p>
                <p>{patient.medicalRecord.diagnosticHypothesis || '-'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Sintomi
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: patient.medicalRecord.simptoms || '-',
                  }}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Motivo della presa in carico
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: patient.medicalRecord.reason || '-',
                  }}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Interventi precedenti
                </p>
                <p>{patient.medicalRecord.previousInterventions || '-'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Note ulteriori
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: patient.medicalRecord.clinicalDataNotes || '-',
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="font-semibold">Intervento</CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Stato
                </p>
                <StateBadge state={patient.medicalRecord.state} />
              </div>

              <div className="col-span-2 space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Obiettivi
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: patient.medicalRecord.goals || '-',
                  }}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <p
                  className="text-sm font-medium leading-none text-muted-foreground"
                  title="Piano terapeutico"
                >
                  Piano terapeutico
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: patient.medicalRecord.therapeuticPlan || '-',
                  }}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Frequenza
                </p>
                <p>{patient.medicalRecord.frequency || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none text-muted-foreground">
                  Data presa in carico
                </p>
                <p>
                  {patient.medicalRecord.takingChargeDate
                    ? format(patient.medicalRecord.takingChargeDate, 'PPP', {
                        locale: it,
                      })
                    : '-'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="font-semibold">Tags</CardHeader>
            <CardContent className="grid gap-4">
              {patient.medicalRecord.tags.length > 0 ? (
                (patient.medicalRecord.tags as PrismaJson.TagType[]).map(
                  (tag) => (
                    <Fragment key={tag.text}>
                      <p className="text-sm font-medium leading-none text-muted-foreground">
                        {tag.text}
                      </p>
                    </Fragment>
                  ),
                )
              ) : (
                <p className="text-sm font-medium leading-none">
                  Nessun tag selezionato
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="font-semibold">Account paziente</CardHeader>
            <CardContent className="grid gap-4">
              {patient.user.accounts.length > 0 ? (
                <>
                  <p className="text-sm font-medium leading-none text-muted-foreground">
                    Nome utente
                  </p>
                  <p>{patient.user.username}</p>
                </>
              ) : (
                <p className="text-sm font-medium leading-none">
                  Nessun account paziente
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
