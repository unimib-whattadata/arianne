'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useTRPC } from '@/trpc/react';

import type { PreferenceValues } from '@arianne/db/schema';
import { preferenceValuesSchema, defaultValues } from '@arianne/db/schema';

const notificationSchema = preferenceValuesSchema.pick({
  notifications: true,
});
type NotificationFormValues = Pick<PreferenceValues, 'notifications'>;

const ITEM = [
  { name: 'appointment', label: 'Conferma o modifica appuntamento' },
  {
    name: '   appointmentReminders',
    label: 'Promemoria appuntamento imminente',
  },
  {
    name: 'newQuestionnaire',
    label: 'Nuovo compito o questionario disponibile',
  },
  {
    name: 'questionnaireReminder',
    label: 'Scadenza compito o questionario imminente',
  },
];

export default function NotificationSettingsPage() {
  const api = useTRPC();

  const {
    data: notificationPrefs,
    isLoading,
    error,
  } = useQuery(api.preferences.get.queryOptions());

  const form = useForm<NotificationFormValues>({});

  // const updateNotifications = useMutation(
  //   api.preferences.set.mutationOptions({
  //     onSuccess: async () => {
  //       await queryClient.invalidateQueries(api.preferences.get.queryFilter());
  //     },
  //   }),
  // );
  useEffect(() => {
    if (notificationPrefs) {
      form.reset(notificationPrefs);
    }
  }, [notificationPrefs, form]);

  // if (isLoading) return <div>Caricamento...</div>;
  // if (error || !notificationPrefs) return <div>Errore nel caricamento</div>;

  return (
    <div className="p-4 pt-0">
      <h1 className="mb-3 text-2xl font-semibold">Preferenze e notifiche</h1>

      <div className="mt-6">
        <div className="mb-3 flex justify-end">
          <Link href="/impostazioni">
            <Button variant="ghost" className="text-primary">
              Annulla
            </Button>
          </Link>
          <Button
            onClick={form.handleSubmit((values) => {
              // updateNotifications.mutate({
              //   type: 'profile',
              //   values,
              // });
            })}
          >
            Salva
          </Button>
        </div>

        <Form {...form}>
          <Card>
            <CardHeader className="font-semibold">Notifiche</CardHeader>
            <CardContent className="grid gap-4">
              {ITEM.map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof FormValues}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <span className="text-base">{label}</span>

                      <FormControl>
                        <Switch
                          // checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>
        </Form>
      </div>
    </div>
  );
}
