'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import format from 'date-fns/format';
import { it } from 'date-fns/locale';
import { Calendar1Icon, Plus, Trash2, TriangleAlert } from 'lucide-react';
import { Fragment, useState } from 'react';
import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
    if (!patient?.profile) {
      toast.error('Paziente non trovato. Ricarica la pagina e riprova.');
      return;
    }

    return await mutateAsync({
      where: { id: patient?.medicalRecordsId },
      data: {
        ...data.medicalRecords,
      },
    });
  };

  const errorHandler: SubmitErrorHandler<FormValues> = (error) => {
    console.error(error);
  };

  if (isLoading || !patient?.profile?.id || !patient?.medicalRecords)
    return <p>Loading...</p>;

  if (edit) {
    return (
      <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
        <div className="bg-background sticky top-0 z-10 pb-3">
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
                    name="medicalRecords.alias"
                    defaultValue={patient.medicalRecords.alias}
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
                    defaultValue={patient.medicalRecords.birthDate ?? undefined}
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
                    name="medicalRecords.sex"
                    defaultValue={patient.medicalRecords.sex ?? undefined}
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

                  <FormField
                    control={form.control}
                    name="medicalRecords.pronoun"
                    defaultValue={patient.medicalRecords.pronoun}
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
                    defaultValue={patient.medicalRecords.occupation}
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
                    defaultValue={patient.medicalRecords.education}
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
                    defaultValue={patient.medicalRecords.otherNotes}
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
                    defaultValue={patient.medicalRecords.motherName}
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
                      patient.medicalRecords.motherStatus ?? undefined
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
                    name="medicalRecords.fatherName"
                    defaultValue={patient.medicalRecords.fatherName}
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
                      patient.medicalRecords.fatherStatus ?? undefined
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
                    defaultValue={patient.medicalRecords.parentsNotes}
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
                      <p className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Nome
                        <span className="text-primary ml-2">Obbligatorio</span>
                      </p>
                      <p className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Parentela
                        <span className="text-primary ml-2">Obbligatorio</span>
                      </p>
                    </>
                  )}
                  {fieldsCaregivers.map((field, index) => (
                    <Fragment key={field.id}>
                      <FormField
                        control={form.control}
                        defaultValue={
                          patient.medicalRecords?.caregivers?.[index]?.name ??
                          ''
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
                          patient.medicalRecords?.caregivers?.[index]
                            ?.kinship ?? undefined
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
                    name="user.phone"
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
              <Card>
                <CardHeader className="font-semibold">Dati clinici</CardHeader>
                <CardContent className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="medicalRecords.diagnosticHypothesis"
                    defaultValue={patient.medicalRecords.diagnosticHypothesis}
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
                    defaultValue={patient.medicalRecords.simptoms}
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
                    defaultValue={patient.medicalRecords.reason}
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
                    defaultValue={patient.medicalRecords.previousInterventions}
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
                    defaultValue={patient.medicalRecords.clinicalDataNotes}
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
                    defaultValue={patient.medicalRecords.highRisk}
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
                    defaultValue={patient.medicalRecords.state}
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
                    defaultValue={patient.medicalRecords.goals}
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
                    defaultValue={patient.medicalRecords.therapeuticPlan}
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
                    defaultValue={patient.medicalRecords.frequency}
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
                      patient.medicalRecords.takingChargeDate ?? undefined
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
                    <p className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Tag
                      <span className="text-primary ml-2">Obbligatorio</span>
                    </p>
                  )}
                  {fieldsTags.map((field, index) => (
                    <Fragment key={field.id}>
                      <FormField
                        control={form.control}
                        name={`medicalRecords.tags.${index}.text`}
                        defaultValue={
                          patient.medicalRecords?.tags?.[index]?.text ?? ''
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
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="bg-background sticky top-0 z-10 pb-3">
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
                  Nome d'elezione
                </p>
                <p>{patient.medicalRecords.alias || '-'}</p>
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
                  Sesso
                </p>
                <p>{patient.medicalRecords.sex || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Genere
                </p>
                <p>{patient.medicalRecords.gender || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Pronome
                </p>
                <p>{patient.medicalRecords.pronoun || '-'}</p>
              </div>
              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Professione
                </p>
                <p>{patient.medicalRecords.occupation || '-'}</p>
              </div>
              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Istruzione
                </p>
                <p>{patient.medicalRecords.education || '-'}</p>
              </div>
              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Note ulteriori
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: patient.medicalRecords.otherNotes || '-',
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="font-semibold">Dati familiari</CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Nome madre
                </p>
                <p>{patient.medicalRecords.motherName || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Stato madre
                </p>
                <p>{patient.medicalRecords.motherStatus || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Nome padre
                </p>
                <p>{patient.medicalRecords.fatherName || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Stato padre
                </p>
                <p>{patient.medicalRecords.fatherStatus || '-'}</p>
              </div>
              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Note ulteriori
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: patient.medicalRecords.parentsNotes || '-',
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="font-semibold">Accompagnatore</CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {patient.medicalRecords.caregivers.length > 0 ? (
                patient.medicalRecords.caregivers.map((caregiver) => (
                  <Fragment key={caregiver.name}>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm leading-none font-medium">
                        Nome
                      </p>
                      <p>{caregiver.name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm leading-none font-medium">
                        Parentela
                      </p>
                      <p>{caregiver.kinship}</p>
                    </div>
                  </Fragment>
                ))
              ) : (
                <p className="text-sm leading-none font-medium">
                  Nessun accompagnatore selezionato
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="font-semibold">Contatti</CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Email
                </p>
                <p>{patient.profile.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Numero di telefono
                </p>
                <p>{patient.profile.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader className="font-semibold">Dati clinici</CardHeader>
            <CardContent className="grid gap-4">
              {patient.medicalRecords.highRisk && (
                <div className="flex items-center gap-2 rounded-md border border-[#e55934] bg-[#faded6] p-3 text-[#e55934]">
                  <TriangleAlert className="h-4 w-4" />
                  <span className="text-base font-medium">High Risk</span>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Ipotesi diagnostica
                </p>
                <p>{patient.medicalRecords.diagnosticHypothesis || '-'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Sintomi
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: patient.medicalRecords.simptoms || '-',
                  }}
                />
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Motivo della presa in carico
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: patient.medicalRecords.reason || '-',
                  }}
                />
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Interventi precedenti
                </p>
                <p>{patient.medicalRecords.previousInterventions || '-'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Note ulteriori
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: patient.medicalRecords.clinicalDataNotes || '-',
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="font-semibold">Intervento</CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Stato
                </p>
                <StateBadge state={patient.medicalRecords.state} />
              </div>

              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Obiettivi
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: patient.medicalRecords.goals || '-',
                  }}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <p
                  className="text-muted-foreground text-sm leading-none font-medium"
                  title="Piano terapeutico"
                >
                  Piano terapeutico
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: patient.medicalRecords.therapeuticPlan || '-',
                  }}
                />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Frequenza
                </p>
                <p>{patient.medicalRecords.frequency || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Data presa in carico
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

          <Card>
            <CardHeader className="font-semibold">Tags</CardHeader>
            <CardContent className="grid gap-4">
              {patient.medicalRecords.tags.length > 0 ? (
                patient.medicalRecords.tags.map((tag) => (
                  <Fragment key={tag.text}>
                    <p className="text-muted-foreground text-sm leading-none font-medium">
                      {tag.text}
                    </p>
                  </Fragment>
                ))
              ) : (
                <p className="text-sm leading-none font-medium">
                  Nessun tag selezionato
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
