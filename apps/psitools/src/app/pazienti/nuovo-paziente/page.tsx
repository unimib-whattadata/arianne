'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import format from 'date-fns/format';
import { it } from 'date-fns/locale';
import { Calendar1Icon, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import type { FormValues } from '@/features/patient/new/schema';
import { defaultValues, FormSchema } from '@/features/patient/new/schema';
import { useTRPC } from '@/trpc/react';
import { cn } from '@/utils/cn';
import { generateUniqueId } from '@/utils/keycloak';

export default function NuovoPaziente() {
  const api = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync } = useMutation(
    api.patient.create.mutationOptions({
      onSuccess: () => {
        toast.success('Paziente creato con successo');
        router.push('/pazienti');
      },
      onError: (error) => {
        toast.error('Errore durante la creazione del paziente');
        console.error(error);
      },
      onSettled: async () => {
        await queryClient.invalidateQueries(
          api.therapist.findUnique.queryFilter(),
        );
      },
    }),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
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
    const uniqueId = generateUniqueId();

    await mutateAsync({
      user: {
        create: {
          ...data.user,
          username: uniqueId,
          name: `${data.user.firstName} ${data.user.lastName}`,
          roles: ['patient'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      medicalRecord: {
        create: {
          ...data.medicalRecords,
        },
      },
    });
  };

  const errorHandler: SubmitErrorHandler<FormValues> = (error) => {
    console.error(error);
  };

  // TODO: Add a loading state to the button
  // TODO: Create Page header component with title required and content optional

  return (
    <main className="relative grid h-full-safe grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="sticky top-0 z-10 bg-background pb-3">
        <h1 className="text-xl font-semibold">Nuovo paziente</h1>
        <div className="flex justify-end">
          <Button variant="ghost" asChild>
            <Link href="/pazienti">Annulla</Link>
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
          <Card>
            <CardHeader className="font-semibold">Dati anamnestici</CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="user.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nome
                      <span className="ml-2 text-primary">Obbligatorio</span>
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cognome
                      <span className="ml-2 text-primary">Obbligatorio</span>
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
                            date > new Date() || date < new Date('1900-01-01')
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

          <div className="flex flex-col gap-3">
            <Card>
              <CardHeader className="font-semibold">Contatti</CardHeader>
              <CardContent className="grid gap-3">
                <FormField
                  control={form.control}
                  name="user.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email
                        <span className="ml-2 text-primary">Obbligatorio</span>
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Telefono
                        <span className="ml-2 text-primary">Obbligatorio</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Telefono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="font-semibold">Accompagnatore</CardHeader>
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
              <CardHeader className="font-semibold">Tags</CardHeader>
              <CardContent
                className={cn('grid gap-3', fieldsTags.length === 0 && 'py-0')}
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
                  type="button"
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
    </main>
  );
}
