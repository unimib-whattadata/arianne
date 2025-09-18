'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTRPC } from '@/trpc/react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { UpdateFormSchema } from '@arianne/db/schemas/profiles';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';

type AccountFormValues = z.infer<typeof UpdateFormSchema>;

const testTherapist: AccountFormValues = {
  firstName: 'Mario',
  lastName: 'Rossi',
  phone: '3331234567',
  email: 'mario.rossi@example.com',
  dateOfBirth: new Date('1985-06-15'),
  placeOfBirth: 'Roma',
  gender: 'male',
  taxCode: 'RSSMRA85H15H501Z',
  vatNumber: '12345678901',
  taxRegime: 'forfettario',
  IBANcode: 'IT60X0542811101000000123456',
  PECemail: 'mario.rossi@pec.it',
  SDIcode: 'ABC1234',
  baseRate: '60',
  priceRange: '50-80',
  maxPatients: 20,
  degree: 'laurea_magistrale',
  specialization: 'clinical_psychology',
  registrationNumber: '12345',
  registrationProvince: 'RM',
  registrationYear: 2012,
  workSettings: 'in_person',
  studioAddress: 'Via dei Test 123',
  studioCity: 'Roma',
  studioProvince: 'RM',
  yearsOfExperience: 10,
  spokenLanguages: 'Italiano, Inglese',
  therapyApproaches: 'behavioral',
  areasOfCompetence: 'Ansia, depressione, disturbi relazionali',
  ageRange: 'adults',
  specialCategories: 'LGBTQ+',
  avatar: 'https://i.pravatar.cc/300',
  bio: "Psicologo clinico con esperienza decennale nel trattamento di disturbi d'ansia e depressione.",
  weekDays: ['tuesday'],
  timeSlots: ['morning'],

  // certifications: undefined,
};

export default function PasswordPage() {
  const api = useTRPC();
  const { data } = useQuery(api.therapists.findUnique.queryOptions());
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState(false);
  const daysOfTheWeek = [
    { label: 'Lunedì', value: 'monday' },
    { label: 'Martedì', value: 'tuesday' },
    { label: 'Mercoledì', value: 'wednesday' },
    { label: 'Giovedì', value: 'thursday' },
    { label: 'Venerdì', value: 'friday' },
    { label: 'Sabato', value: 'saturday' },
    { label: 'Domenica', value: 'sunday' },
  ];

  const timeSlots = [
    { label: 'Mattina (8:00 - 12:00)', value: 'morning' },
    { label: 'Pomeriggio (12:00 - 16:00)', value: 'afternoon' },
    { label: 'Sera (16:00 - 20:00)', value: 'evening' },
  ];

  const therapyApproachesOptions = [
    { label: 'Cognitivo comportamentale', value: 'cognitive' },
    { label: 'Psicodinamico', value: 'behavioral' },
    { label: 'Sistemico-relazionale', value: 'humanistic' },
    { label: 'Strategico Breve', value: 'integrative' },
  ];

  const { data: therapist } = useQuery(
    api.therapists.findUnique.queryOptions(),
  );

  function mapValuesToLabels(
    values: string[] | undefined,
    options: { label: string; value: string }[],
  ): string {
    if (!values || values.length === 0) return '-';
    return values
      .map((val) => options.find((opt) => opt.value === val)?.label ?? val)
      .join(', ');
  }

  function mapValueToLabel(
    value: string | undefined,
    options: { label: string; value: string }[],
  ): string {
    if (!value) return '-';
    return options.find((opt) => opt.value === value)?.label ?? value;
  }

  const restPassword = /* async */ () => {
    if (submitting || !data?.profile) return;
    setSubmitting(true);
    // TODO: modifica password
    setSubmitting(false);
  };

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(UpdateFormSchema),
  });

  if (!therapist) return null;

  if (edit) {
    return (
      <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
        <div className="bg-background sticky top-0 z-10 pb-3">
          <h1 className="text-xl font-semibold">Account e password</h1>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                form.reset(testTherapist);
                setEdit(false);
              }}
            >
              Annulla
            </Button>
            <Button
              className="ml-2"
              // onClick={form.handleSubmit(submintHandler, errorHandler)}
            >
              Salva
            </Button>
          </div>
          <Form {...form}>
            <form className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Card>
                  <CardHeader className="font-semibold">
                    Scheda di presentazione{' '}
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="bio"
                      defaultValue={testTherapist.bio}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Bio professionale </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Max 500 caratteri"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="areasOfCompetence"
                      defaultValue={testTherapist.areasOfCompetence}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ambiti di interesse</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ambiti di interesse"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="therapyApproaches"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Orientamento terapeutico</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              defaultValue={testTherapist.therapyApproaches}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleziona l'orientamento terapeutico" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cognitive">
                                  Cognitivo comportamentale
                                </SelectItem>
                                <SelectItem value="behavioral">
                                  Psicodinamico
                                </SelectItem>
                                <SelectItem value="humanistic">
                                  Sistemico-relazionale
                                </SelectItem>
                                <SelectItem value="integrative">
                                  Strategico Breve
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weekDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disponibilità</FormLabel>
                          <FormControl>
                            <MultiSelect
                              id="weekDays"
                              searchable={false}
                              value={field.value ?? []}
                              onValueChange={field.onChange}
                              options={daysOfTheWeek}
                              placeholder="Seleziona i giorni della settimana"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timeSlots"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fasce orarie disponibili </FormLabel>
                          <FormControl>
                            <MultiSelect
                              id="timeSlots"
                              searchable={false}
                              value={field.value ?? []}
                              onValueChange={field.onChange}
                              options={timeSlots}
                              placeholder="Seleziona le fasce orarie disponibili"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="baseRate"
                      defaultValue={testTherapist.baseRate}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Tariffa base per seduta</FormLabel>
                          <FormControl>
                            <Input placeholder="Tariffa base" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="font-semibold">Contatti </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      defaultValue={testTherapist.email}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Inserisci Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      defaultValue={testTherapist.phone}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Numero di telefono</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Numero di Telefono"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-col gap-3">
                <Card className="w-full">
                  <CardHeader className="font-semibold"> Password</CardHeader>
                  <CardContent>
                    <p>Invia email per la modifica della password</p>
                    <Button
                      className="mt-4 px-0 underline hover:opacity-70"
                      variant="link"
                      onClick={restPassword}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Inviando...
                        </>
                      ) : (
                        'Invia email di recupero'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="bg-background sticky top-0 z-10 pb-3">
        <h1 className="text-xl font-semibold">Account e password</h1>
        <div className="flex justify-end">
          <Button className="ml-2" onClick={() => setEdit(true)}>
            Modifica
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <Card className="w-full">
            <CardHeader className="font-semibold">
              Scheda di presentazione
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex w-full gap-2">
                <Image
                  src={testTherapist.avatar!}
                  width={300}
                  height={300}
                  alt="Avatar"
                  className="bg-primary h-24 w-24 rounded-md"
                />
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm leading-none font-medium">
                    Bio professionale
                  </p>
                  <p>{testTherapist.bio}</p>
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Ambiti di interesse
                </p>
                <p>{testTherapist.areasOfCompetence || '-'}</p>
              </div>
              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Orientamento
                </p>
                <p>
                  {mapValueToLabel(
                    testTherapist.therapyApproaches,
                    therapyApproachesOptions,
                  ) || '-'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Disponibilità
                </p>
                <p>
                  {mapValuesToLabels(testTherapist.weekDays, daysOfTheWeek)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Fasce orarie
                </p>
                <p>{mapValuesToLabels(testTherapist.timeSlots, timeSlots)}</p>
              </div>

              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Costo a seduta
                </p>
                <p>{testTherapist.baseRate || '-'}€</p>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader className="font-semibold">Contatti</CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Email
                </p>
                <p>{therapist.profile.email}</p>
              </div>
              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Telefono
                </p>
                <p>{therapist.profile.phone || '-'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-3">
          <Card className="w-full">
            <CardHeader className="font-semibold"> Password</CardHeader>
            <CardContent>
              <p>Invia email per la modifica della password</p>
              <Button
                className="mt-4 px-0 underline hover:opacity-70"
                variant="link"
                onClick={restPassword}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inviando...
                  </>
                ) : (
                  'Invia email di recupero'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
