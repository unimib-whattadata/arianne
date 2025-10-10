'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import Link from 'next/link';
import { CalendarIcon, UserRound } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/utils/cn';
import { it } from 'date-fns/locale';
import { useTRPC } from '@/trpc/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface PersonalFormData {
  name: string;
  surname: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  alias: string;
  pronouns: string;
  gender: string;
  sex: string;
  work: string;
  education: string;
  previousInterventions: string;
}

export default function Personal() {
  const api = useTRPC();
  const queryClient = useQueryClient();
  const savePersonalData = useMutation(
    api.patientsPersonal.save.mutationOptions({
      onSuccess: async (_) => {
        await queryClient.invalidateQueries({
          queryKey: api.patients.get.queryKey(),
        });
      },
      onError: () => {
        console.log('ERROR');
      },
    }),
  );

  const form = useForm<PersonalFormData>({
    defaultValues: {
      name: '',
      surname: '',
      dateOfBirth: new Date(),
      placeOfBirth: '',
      alias: '',
      pronouns: '',
      gender: '',
      sex: '',
      work: '',
      education: '',
      previousInterventions: '',
    },
  });

  const onSubmit: SubmitHandler<PersonalFormData> = (data) => {
    console.log('Form data:', data);
    savePersonalData.mutate(data);
    window.location.href = '/questionnaire';
  };
  const onError = () => {
    toast.error('Per favore compila tutti i campi prima di procedere');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10">
      <div className="mt-8 flex w-full flex-1 flex-col gap-4 p-4 pt-12 md:mt-0 md:p-10 md:pt-24">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <div className="mx-auto flex max-w-3xl flex-col items-start">
              <UserRound className="text-primary mb-4 h-10 w-10 sm:h-12 sm:w-12" />
              <h1 className="mb-4 text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-4xl">
                Dati anagrafici
              </h1>
              <p className="mb-4 text-sm leading-relaxed text-slate-700 sm:mb-4 sm:text-base">
                Per iniziare il tuo percorso, abbiamo bisogno di alcune
                informazioni di base. Ci vorranno solo pochi minuti.
              </p>

              <div className="flex w-full flex-col gap-4 sm:flex-row sm:gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: 'Il nome è obbligatorio' }}
                  render={({ field }) => (
                    <FormItem className="w-full sm:flex-1">
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-secondary-light mt-2 w-full"
                          placeholder="Nome"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surname"
                  rules={{ required: 'Il cognome è obbligatorio' }}
                  render={({ field }) => (
                    <FormItem className="w-full sm:flex-1">
                      <FormLabel>Cognome</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-secondary-light mt-2 w-full"
                          placeholder="Cognome"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row sm:gap-4">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  rules={{ required: 'La data di nascita è obbligatoria' }}
                  render={({ field }) => (
                    <FormItem className="w-full sm:flex-1">
                      <FormLabel>Data di nascita</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'bg-secondary-light hover:bg-secondary-foreground mt-2 w-full border border-none pl-3 text-left font-normal text-slate-900 hover:text-slate-900',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP', { locale: it })
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                              locale={it}
                              className="border-primary rounded-md border"
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
                  rules={{
                    required: 'Il luogo di nascita è obbligatorio',
                  }}
                  render={({ field }) => (
                    <FormItem className="w-full sm:flex-1">
                      <FormLabel>Luogo di nascita</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-secondary-light mt-2 w-full"
                          placeholder="Luogo di nascita"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row sm:gap-4">
                <FormField
                  control={form.control}
                  name="alias"
                  rules={{ required: 'Con quale nome vuoi essere chiamato?' }}
                  render={({ field }) => (
                    <FormItem className="w-full sm:flex-1">
                      <FormLabel>Alias</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-secondary-light mt-2 w-full"
                          placeholder="Alias"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pronouns"
                  rules={{ required: 'Quali pronomi preferisci?' }}
                  render={({ field }) => (
                    <FormItem className="w-full sm:flex-1">
                      <FormLabel>Pronomi</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-secondary-light mt-2 w-full"
                          placeholder="Pronomi"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row sm:gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  rules={{ required: 'Il genere è obbligatorio' }}
                  render={({ field }) => (
                    <FormItem className="w-full sm:flex-1">
                      <FormLabel>Genere</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="bg-secondary-light hover:bg-secondary-foreground mt-2 w-full border border-none hover:text-slate-900">
                            <SelectValue placeholder="Seleziona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="female">Femminile</SelectItem>
                            <SelectItem value="male">Maschile</SelectItem>
                            <SelectItem value="intersex">Intersex</SelectItem>
                            <SelectItem value="prefer-not-to-say">
                              Preferisco non specificare
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sex"
                  rules={{ required: 'Il sesso è obbligatorio' }}
                  render={({ field }) => (
                    <FormItem className="w-full sm:flex-1">
                      <FormLabel>Sesso</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="bg-secondary-light mt-2 w-full">
                            <SelectValue placeholder="Seleziona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="woman">Donna</SelectItem>
                            <SelectItem value="man">Uomo</SelectItem>
                            <SelectItem value="non-binary">
                              Non binario
                            </SelectItem>
                            <SelectItem value="other">Altro</SelectItem>
                            <SelectItem value="prefer-not-to-say">
                              Preferisco non specificare
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row sm:gap-4">
                <FormField
                  control={form.control}
                  name="work"
                  rules={{ required: 'Quale occupazione hai?' }}
                  render={({ field }) => (
                    <FormItem className="w-full sm:flex-1">
                      <FormLabel>Occupazione</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-secondary-light mt-2 w-full"
                          placeholder="Occupazione"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="education"
                  rules={{ required: 'Specifica il titolo di studio' }}
                  render={({ field }) => (
                    <FormItem className="w-full sm:flex-1">
                      <FormLabel>Titolo di studio</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="bg-secondary-light mt-2 w-full"
                          placeholder="Titolo di studio"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="previousInterventions"
                rules={{ required: 'Specifica i precedenti interventi' }}
                render={({ field }) => (
                  <FormItem className="mt-4 w-full sm:flex-1">
                    <FormLabel>
                      Hai già seguito un percorso di terapia?
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-secondary-light mt-2 w-full">
                          <SelectValue placeholder="Seleziona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes-now">
                            Sì, la sto facendo adesso
                          </SelectItem>
                          <SelectItem value="yes-past">
                            Sì, l’ho fatta in passato
                          </SelectItem>
                          <SelectItem value="no">
                            No, non l’ho mai fatta
                          </SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            Preferisco non dirlo{' '}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
                <Button className="w-full sm:flex-1" variant="outline">
                  <Link href="/onboarding" className="w-full text-center">
                    Torna alla lista degli step
                  </Link>
                </Button>
                <Button
                  className="w-full sm:flex-1"
                  variant="secondary"
                  type="submit"
                >
                  Passa al prossimo step
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
