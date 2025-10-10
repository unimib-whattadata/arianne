'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CloudUpload, Users } from 'lucide-react';
import Link from 'next/link';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useTRPC } from '@/trpc/react';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { redirect, useRouter } from 'next/navigation';
import { useTherapist } from '@/hooks/use-therapist';

interface OnboardingFormData {
  name: string;
  surname: string;
  email: string;
  subscriptionNumber: string;
  therapeuticOrientation: string;
  specialization: string;
  experienceYears: string;
  location: string;
  country: string;
  city: string;
  province: string;
  cap: string;
  cv: FileList | null;
  acceptanceConditions: boolean;
}

export default function Onboarding() {
  const { user } = useTherapist();
  const router = useRouter();
  const api = useTRPC();
  const queryClient = useQueryClient();
  const saveOnboardingTherapist = useMutation(
    api.onboardingTherapist.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          api.therapists.findUnique.queryFilter(),
        );
        router.push('/onboarding/landing');
      },
    }),
  );
  const form = useForm<OnboardingFormData>({
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      subscriptionNumber: '',
      therapeuticOrientation: '',
      specialization: '',
      experienceYears: '',
      location: '',
      country: '',
      city: '',
      province: '',
      cap: '',
      cv: null,
      acceptanceConditions: false,
    },
  });

  const onSubmit: SubmitHandler<OnboardingFormData> = (data) => {
    saveOnboardingTherapist.mutate(data);
  };

  return (
    <main className="min-h-safe px-6 py-36 sm:px-8 lg:px-12 lg:py-36">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mx-auto flex max-w-3xl flex-col items-start">
            <Users className="text-primary mb-4 h-10 w-10" />
            <h1 className="mb-4 text-2xl font-medium text-slate-900 sm:text-4xl">
              Vuoi far parte del team di Arianne?
            </h1>
            <h2 className="text-lg text-slate-900 sm:text-xl">
              Compila il form e inviaci la tua candidatura
            </h2>
            <p className="mt-6 leading-relaxed text-slate-700">
              Dopo aver valutato il tuo profilo, ti contatteremo via email per
              comunicarti l&apos;esito. <br />
              Se il profilo risulterà in linea con le nostre esigenze, ti
              inviteremo a un colloquio conoscitivo.
            </p>

            <div className="mt-10 flex w-full flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: 'Il nome è obbligatorio' }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <p className="text-slate-900">Nome</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Nome"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surname"
                rules={{ required: 'Il cognome è obbligatorio' }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <p className="text-slate-900">Cognome</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        placeholder="Cognome"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6 flex w-full flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                rules={{ required: "L'email è obbligatoria" }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <p className="text-slate-900">Email</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subscriptionNumber"
                rules={{ required: 'Il numero di iscrizione è obbligatorio' }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <p className="text-slate-900">
                      Numero di iscrizione all&apos;Albo
                    </p>
                    <FormControl>
                      <Input className="mt-2 w-full" {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6 flex w-full flex-col gap-4">
              <FormField
                control={form.control}
                name="therapeuticOrientation"
                rules={{ required: 'Questo campo è obbligatorio' }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <p className="text-slate-900">Orientamento terapeutico</p>
                    <FormControl>
                      <Input className="mt-2 w-full" {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialization"
                rules={{ required: 'Questo campo è obbligatorio' }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <p className="text-slate-900">Specializzazione</p>
                    <FormControl>
                      <Input className="mt-2 w-full" {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experienceYears"
                rules={{
                  required: 'Inserisci il numero di anni di esperienza',
                }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <p className="text-slate-900">Anni di esperienza</p>
                    <FormControl>
                      <Input
                        className="mt-2 w-full"
                        type="number"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              rules={{ required: 'Seleziona dove eserciti' }}
              render={({ field, fieldState }) => (
                <FormItem className="mt-6 w-full">
                  <p className="text-slate-900">Dove esercita?</p>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-secondary-light w-full">
                        <SelectValue placeholder="Seleziona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pubblico">Pubblico</SelectItem>
                        <SelectItem value="privato">Privato</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <div className="mt-6 flex w-full flex-col gap-4 sm:flex-row">
              <FormField
                control={form.control}
                name="country"
                rules={{ required: 'Seleziona un paese' }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <p className="text-slate-900">Paese</p>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-secondary-light mt-2 w-full">
                          <SelectValue placeholder="Seleziona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="italia">Italia</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                rules={{ required: 'La città è obbligatoria' }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <p className="text-slate-900">Città</p>
                    <FormControl>
                      <Input className="mt-2 w-full" {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="province"
                rules={{ required: 'La provincia è obbligatoria' }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <p className="text-slate-900">Provincia</p>
                    <FormControl>
                      <Input className="mt-2 w-full" {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cap"
                rules={{ required: 'Il CAP è obbligatorio' }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <p className="text-slate-900">CAP</p>
                    <FormControl>
                      <Input className="mt-2 w-full" {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cv"
              rules={{ required: 'Il caricamento del CV è obbligatorio' }}
              render={({ field: { onChange, value }, fieldState }) => (
                <FormItem className="mt-6 w-full">
                  <p className="text-slate-900">
                    Carica il tuo CV in formato PDF
                  </p>
                  <FormControl>
                    <label
                      htmlFor="cv-upload"
                      className="bg-secondary-light hover:border-primary mt-2 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 transition-colors"
                    >
                      {value && value.length > 0 ? (
                        <>
                          <p className="font-medium text-slate-700">
                            File caricato:
                          </p>
                          <p className="text-primary mt-1 text-sm">
                            {value[0].name}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-slate-500">
                            Carica qui i tuoi file
                          </p>
                          <CloudUpload className="mt-2 h-[40px] w-[40px] text-slate-400" />
                        </>
                      )}
                      <Input
                        id="cv-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => onChange(e.target.files)}
                      />
                    </label>
                  </FormControl>
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <p className="mt-8 text-slate-700">
              Per completare la candidatura è necessario il consenso al
              trattamento dei dati personali secondo i nostri Termini e
              Condizioni e l&apos;Informativa sulla Privacy.
            </p>
            <FormField
              control={form.control}
              name="acceptanceConditions"
              rules={{ required: 'Devi accettare i termini' }}
              render={({ field, fieldState }) => (
                <FormItem className="mt-4 flex items-start gap-2 text-slate-900">
                  <FormControl>
                    <Checkbox
                      id="termini"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <label htmlFor="termini" className="text-sm leading-snug">
                    Ho letto e accetto i
                    <span className="text-primary"> Termini e Condizioni</span>{' '}
                    e{' '}
                    <span className="text-primary">
                      l&apos;Informativa sulla Privacy
                    </span>
                    * di Arianne
                  </label>
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <Button className="mt-10 w-full" variant="secondary" type="submit">
              Invia la tua candidatura
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
