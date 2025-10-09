'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useTRPC } from '@/trpc/react';

import type {} from '@arianne/db/schemas/preferences';
import z from 'zod';

const ITEM = [
  { name: 'patientMessages', label: 'Messaggio paziente' },
  {
    name: 'assignmentCompleted',
    label: 'Assegnazione completata',
  },
  { name: 'eventModified', label: 'Evento modificato' },
  { name: 'eventCancelled', label: 'Evento annullato' },
] as const;

const notificationSchema = z.object({
  patientMessages: z.boolean(),
  assignmentCompleted: z.boolean(),
  eventModified: z.boolean(),
  eventCancelled: z.boolean(),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

export default function NotificationSettingsPage() {
  const api = useTRPC();
  const queryClient = useQueryClient();

  const {
    data: notificationPrefs,
    isLoading,
    error,
  } = useQuery(
    api.preferences.get.queryOptions(
      {
        key: 'notifications',
      },
      {
        select: (data) => data?.value as NotificationFormValues | undefined,
      },
    ),
  );

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    values: notificationPrefs ?? {
      patientMessages: true,
      assignmentCompleted: true,
      eventModified: true,
      eventCancelled: true,
    },
  });

  const updateNotifications = useMutation(
    api.preferences.set.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(api.preferences.get.queryFilter());
      },
    }),
  );

  if (isLoading) return <div>Caricamento...</div>;
  if (error) return <div>Errore nel caricamento</div>;

  const handleSubmit: SubmitHandler<NotificationFormValues> = (data) => {
    updateNotifications.mutate({
      key: 'notifications',
      value: data,
    });
  };

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
          <Button onClick={form.handleSubmit(handleSubmit)}>Salva</Button>
        </div>

        <Form {...form}>
          <Card>
            <CardHeader className="font-semibold">Notifiche</CardHeader>
            <CardContent className="grid gap-4">
              {ITEM.map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <span className="text-base">{label}</span>

                      <FormControl>
                        <Switch
                          checked={field.value}
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
