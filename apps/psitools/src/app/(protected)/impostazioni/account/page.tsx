'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState } from 'react';
import type { z } from 'zod';
import { UpdateFormSchema } from '@arianne/db/schemas/profiles';

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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  // certifications: undefined,
};

const options = [
  { label: 'Bambini', value: 'children' },
  { label: 'Adolescenti', value: 'adolescents' },
  { label: 'Adulti', value: 'adults' },
  { label: 'Anziani', value: 'elderly' },
];

const categoriesOptions = [
  { label: 'LGBTQ+', value: 'LGBTQ+' },
  { label: 'Disabilità', value: 'disabilities' },
  { label: 'Malattie croniche', value: 'chronic_illness' },
  { label: 'Altro', value: 'other' },
];

export default function AccountPage() {
  const api = useTRPC();
  const _queryClient = useQueryClient();

  const { data: therapist } = useQuery(
    api.therapists.findUnique.queryOptions(),
  );

  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  // const form = useForm<AccountFormValues>({
  //   resolver: zodResolver(UpdateFormSchema),
  //   values: therapist?.profile
  //     ? {
  //         firstName: therapist.profile.firstName,
  //         lastName: therapist.profile.lastName,
  //         phone: therapist.profile.phone,
  //         email: therapist.profile.email,
  //       }
  //     : {
  //         firstName: '',
  //         lastName: '',
  //         phone: '',
  //         email: '',
  //       },
  // });

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(UpdateFormSchema),
    values: testTherapist,
  });

  if (!therapist) {
    return (
      <div className="h-full-safe flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Caricamento...</p>
      </div>
    );
  }

  const onSubmit: SubmitHandler<AccountFormValues> = /* async */ (_data) => {
    if (!therapist?.profile) {
      toast.error("C'è stato un errore nel recupero dei dati dell'account.");
      return;
    }

    // const profile = {
    //   firstName: data.firstName,
    //   lastName: data.lastName,
    //   attributes: {
    //     phoneNumber: data.phone ? [data.phone] : [],
    //   },
    //   email: data.email,
    // } satisfies Partial<KeycloakUser>;

    // TODO: Update user profile
  };

  if (edit) {
    return (
      <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
        <div className="bg-background sticky top-0 z-10 pb-3">
          <h1 className="text-xl font-semibold">Dati personali</h1>
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
        </div>
        <Form {...form}>
          <form className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Card>
                <CardHeader className="font-semibold">
                  Dati anagrafici
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="firstName"
                    defaultValue={testTherapist.firstName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome </FormLabel>
                        <FormControl>
                          <Input placeholder="Nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    defaultValue={testTherapist.lastName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cognome</FormLabel>
                        <FormControl>
                          <Input placeholder="Cognome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data di nascita</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Input
                                readOnly
                                placeholder="Seleziona una data"
                                className="text-left"
                                value={
                                  field.value
                                    ? format(field.value, 'dd/MM/yyyy')
                                    : ''
                                }
                              />
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => field.onChange(date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="placeOfBirth"
                    defaultValue={testTherapist.placeOfBirth}
                    render={({ field }) => (
                      <FormItem>
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
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Genere</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona il genere" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Maschio</SelectItem>
                              <SelectItem value="female">Femmina</SelectItem>
                              <SelectItem value="other">Altro</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxCode"
                    defaultValue={testTherapist.taxCode}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Codice Fiscale</FormLabel>
                        <FormControl>
                          <Input placeholder="Codice Fiscale" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="font-semibold">Dati fiscali</CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="vatNumber"
                    defaultValue={testTherapist.vatNumber}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Partita IVA </FormLabel>
                        <FormControl>
                          <Input placeholder="Partita IVA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxRegime"
                    defaultValue={testTherapist.taxRegime}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Regime Fiscale</FormLabel>
                        <FormControl>
                          <Input placeholder="Regime Fiscale" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="IBANcode"
                    defaultValue={testTherapist.IBANcode}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>IBAN</FormLabel>
                        <FormControl>
                          <Input placeholder="IBAN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="PECemail"
                    defaultValue={testTherapist.PECemail}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PEC</FormLabel>
                        <FormControl>
                          <Input placeholder="PEC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="SDIcode"
                    defaultValue={testTherapist.SDIcode}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Codice SDI</FormLabel>
                        <FormControl>
                          <Input placeholder="Codice SDI" {...field} />
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
                      <FormItem>
                        <FormLabel>Tariffa base per seduta</FormLabel>
                        <FormControl>
                          <Input placeholder="Tariffa base" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priceRange"
                    defaultValue={testTherapist.priceRange}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fascia tariffaria (facoltativa)</FormLabel>
                        <FormControl>
                          <Input placeholder="Fascia tariffaria" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxPatients"
                    defaultValue={testTherapist.maxPatients}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Numero massimo di pazienti</FormLabel>
                        <FormControl>
                          <Input placeholder="Numero massimo" {...field} />
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
                <CardHeader className="font-semibold">
                  Qualifiche professionali
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="degree"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Titolo di studio</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona il titolo di studio" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="laurea_magistrale">
                                Laurea magistrale in psicologia
                              </SelectItem>
                              <SelectItem value="laurea_triennale">
                                Laurea triennale in psicologia
                              </SelectItem>
                              <SelectItem value="laurea_specialistica">
                                Laurea specialistica in psicologia
                              </SelectItem>
                              <SelectItem value="laurea_vecchio_ordinamento">
                                Vecchio ordinamento
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
                    name="specialization"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Titolo di studio</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona il titolo di studio" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="clinical_psychology">
                                Psicologia clinica
                              </SelectItem>
                              <SelectItem value="health_psychology">
                                Psicologia della salute
                              </SelectItem>
                              <SelectItem value="child_adolescent_psychology">
                                Psicologia dell'età evolutiva
                              </SelectItem>
                              <SelectItem value="work_organizational_psychology">
                                Psicologia del lavoro e delle organizzazioni
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
                    name="registrationNumber"
                    defaultValue={testTherapist.registrationNumber}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Numero di iscrizione all'albo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Numero di iscrizione all'albo"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="registrationProvince"
                    defaultValue={testTherapist.registrationProvince}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provincia di iscrizione</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Provincia di iscrizione"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="registrationYear"
                    defaultValue={testTherapist.registrationYear}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anno di iscrizione</FormLabel>
                        <FormControl>
                          <Input placeholder="Anno di iscrizione" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="certifications"
                    defaultValue={testTherapist.certifications}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Certificazioni e CV</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            placeholder="Certificazioni e CV"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="font-semibold">
                  Esperienza clinica
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="workSettings"
                    defaultValue={testTherapist.workSettings}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Modalità di lavoro</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona la modalità di lavoro" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="in_person">
                                In presenza
                              </SelectItem>
                              <SelectItem value="remote">Online </SelectItem>
                              <SelectItem value="hybrid">
                                Sia online che in presenza
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(form.watch('workSettings') === 'in_person' ||
                    form.watch('workSettings') === 'hybrid') && (
                    <>
                      <FormField
                        control={form.control}
                        name="studioAddress"
                        defaultValue={testTherapist.studioAddress}
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Indirizzo studio</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Indirizzo studio"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="studioCity"
                        defaultValue={testTherapist.studioCity}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Paese</FormLabel>
                            <FormControl>
                              <Input placeholder="Paese" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="studioProvince"
                        defaultValue={testTherapist.studioProvince}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provincia</FormLabel>
                            <FormControl>
                              <Input placeholder="Provincia" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="yearsOfExperience"
                    defaultValue={testTherapist.yearsOfExperience}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anni di esperienza</FormLabel>
                        <FormControl>
                          <Input placeholder="Anni di esperienza" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spokenLanguages"
                    defaultValue={testTherapist.spokenLanguages}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lingue parlate</FormLabel>
                        <FormControl>
                          <Input placeholder="Lingue parlate" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="therapyApproaches"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Orientamento terapeutico</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
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
                    name="areasOfCompetence"
                    defaultValue={testTherapist.areasOfCompetence}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Aree di competenza</FormLabel>
                        <FormControl>
                          <Input placeholder="Aree di competenza" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ageRange"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>
                          Esperienza con fasce d’età specifiche
                        </FormLabel>
                        <FormControl>
                          <MultiSelect
                            id="ageRange"
                            searchable={false}
                            value={field.value ? [field.value] : []}
                            onValueChange={(value) => {
                              field.onChange(value[0] ?? null);
                            }}
                            options={options}
                            placeholder="Seleziona le fasce d'età"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialCategories"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>
                          Esperienza con categorie specifiche
                        </FormLabel>
                        <FormControl>
                          <MultiSelect
                            id="specialCategories"
                            searchable={false}
                            value={field.value ? [field.value] : []}
                            onValueChange={(value) => {
                              field.onChange(value[0] ?? null);
                            }}
                            options={categoriesOptions}
                            placeholder="Seleziona le categorie specifiche"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
        <h1 className="text-xl font-semibold">Dati personali</h1>
        <div className="flex justify-end">
          <Button className="ml-2" onClick={() => setEdit(true)}>
            Modifica
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader className="font-semibold">Dati anagrafici</CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Nome
                </p>
                <p>{testTherapist.firstName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Cognome
                </p>
                <p>{testTherapist.lastName}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Data di nascita
                </p>
                <p>
                  {testTherapist.dateOfBirth
                    ? format(testTherapist.dateOfBirth, 'dd MMMM yyyy', {
                        locale: it,
                      })
                    : '-'}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Luogo di nascita
                </p>
                <p>{testTherapist.placeOfBirth || '-'}</p>
              </div>

              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Genere
                </p>
                <p>{testTherapist.gender || '-'}</p>
              </div>
              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Codice Fiscale
                </p>
                <p>{testTherapist.taxCode || '-'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="font-semibold">Dati fiscali</CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Partita IVA
                </p>
                <p>{testTherapist.vatNumber || '-'}</p>
              </div>
              <div className="sspace-y-2 col-span-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Regime fiscale
                </p>
                <p>{testTherapist.taxRegime || '-'}</p>
              </div>
              <div className="sspace-y-2 col-span-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  IBAN
                </p>
                <p>{testTherapist.IBANcode || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  PEC
                </p>
                <p>{testTherapist.PECemail || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Codice SDI
                </p>
                <p>{testTherapist.SDIcode || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Tariffa base per seduta
                </p>
                <p>{testTherapist.baseRate || '-'}€</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Fascia tariffaria
                </p>
                <p>{testTherapist.priceRange || '-'} €</p>
              </div>
              <div className="col-span-2 space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Numero massimo di pazienti
                </p>
                <p>{testTherapist.maxPatients || '-'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader className="font-semibold">
              Qualifiche professionali
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Titolo di studio
                </p>
                <p>{testTherapist.degree || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Scuola di specializzazione
                </p>
                <p>{testTherapist.specialization || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Numero di iscrizione all'albo
                </p>
                <p>{testTherapist.registrationNumber || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Provincia di iscrizione
                </p>
                <p>{testTherapist.registrationProvince || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Anno di iscrizione
                </p>
                <p>{testTherapist.registrationYear || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Certificazioni e CV
                </p>
                <Link href={'#'} className="text-primary underline">
                  ProvaC.pdf
                  {/* {testTherapist.certifications} */}
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="font-semibold">
              Esperienza clinica e approccio terapeutico
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Modalità di lavoro
                </p>
                <p>{testTherapist.workSettings || '-'}</p>
              </div>

              {testTherapist.workSettings === 'in_person' && (
                <>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm leading-none font-medium">
                      Indirizzo studio
                    </p>
                    <p>{testTherapist.studioAddress || '-'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm leading-none font-medium">
                      Città studio
                    </p>
                    <p>{testTherapist.studioCity || '-'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm leading-none font-medium">
                      Provincia studio
                    </p>
                    <p>{testTherapist.studioProvince || '-'}</p>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Anni di esperienza
                </p>
                <p>{testTherapist.yearsOfExperience || '-'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Lingue parlate
                </p>
                <p>{testTherapist.spokenLanguages || '-'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Orientamento terapeutico
                </p>
                <p>{testTherapist.therapyApproaches || '-'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Aree di competenza
                </p>
                <p>{testTherapist.areasOfCompetence || '-'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Esperienza con fasce d'età specifiche
                </p>
                <p>{testTherapist.ageRange || '-'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm leading-none font-medium">
                  Esperienza con categorie specifiche
                </p>
                <p>{testTherapist.specialCategories || '-'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
