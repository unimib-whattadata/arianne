'use client';

import { CheckCircle2, GalleryVerticalEnd } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendPasswordResetEmail } from './actions';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootMessage,
} from '@/components/ui/form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email('Inserisci un indirizzo email valido'),
});

export default function PasswordRecoveryPage() {
  const [success, setSuccess] = useState({
    emailSent: false,
    emailAddress: '',
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', data);

    const formData = new FormData();
    formData.append('email', data.email);

    const error = await sendPasswordResetEmail(formData);

    if (error) {
      form.setError('root', {
        type: 'value',
        message: error,
      });
      return;
    }

    setSuccess({
      emailSent: true,
      emailAddress: data.email,
    });

    form.reset();
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <div className={cn('flex flex-col gap-6')}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Bentornato/a</CardTitle>
              <CardDescription>
                Inserisci la email alla quale vuoi ricevere le istruzioni per il
                recupero della password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid gap-6">
                    <FormRootMessage />

                    <Alert className={!success.emailSent ? 'hidden' : ''}>
                      <CheckCircle2 />
                      <AlertTitle>
                        Email di recupero inviata con successo!
                      </AlertTitle>
                      <AlertDescription>
                        <p>
                          Abbiamo inviato le istruzioni per il recupero della
                          password a{' '}
                          <span className="font-bold break-all">
                            {success.emailAddress}
                          </span>
                        </p>
                      </AlertDescription>
                    </Alert>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="grid space-y-3">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="m@example.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Invia email di recupero
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
