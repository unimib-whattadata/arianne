'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
import { useTRPC } from '@/trpc/react';

const accountFormSchema = z.object({
  firstName: z.string().min(1, 'Il nome è obbligatorio'),
  lastName: z.string().min(1, 'Il cognome è obbligatorio'),
  phone: z.string().optional(),
  email: z.string().email('Email non valida'),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function AccountPage() {
  const api = useTRPC();
  const _queryClient = useQueryClient();

  const { data: therapist } = useQuery(
    api.therapists.findUnique.queryOptions(),
  );

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    values: therapist?.user
      ? {
          firstName: therapist.profile.firstName,
          lastName: therapist.profile.lastName,
          phone: therapist.profile.phone ?? '',
          email: therapist.profile.email,
        }
      : {
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
        },
  });

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

  return (
    <div className="p-4 pt-0">
      <h1 className="mb-3 text-2xl font-semibold">Account</h1>

      <div className="mt-6">
        <div className="mb-3 flex justify-end">
          <Button variant="ghost" className="text-primary" asChild>
            <Link href="/impostazioni">Annulla</Link>
          </Button>
          <Button className="ml-2" onClick={form.handleSubmit(onSubmit)}>
            Salva
          </Button>
        </div>

        <Form {...form}>
          <Card>
            <CardHeader className="font-semibold">Dati personali</CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[14px]">Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Inserisci il tuo nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[14px]">Cognome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Inserisci il tuo cognome"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[14px]">Telefono</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Inserisci il tuo numero di telefono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[14px]">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Inserisci la tua email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </Form>
      </div>
    </div>
  );
}
