'use client';

import type { LucideProps } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
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
import { signup } from './actions';
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
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Logo } from '@/components/brand';
import { Spinner } from '@/components/ui/spinner';

const formSchema = z.object({
  account: z
    .object({
      email: z.string().email('Inserisci un indirizzo email valido'),
      password: z
        .string()
        .min(6, 'La password deve contenere almeno 6 caratteri'),
      passwordConfirmation: z
        .string()
        .min(6, 'La password deve contenere almeno 6 caratteri'),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Le password non corrispondono',
    }),
  profile: z.object({
    firstName: z.string().min(1, 'Il nome è obbligatorio'),
    lastName: z.string().min(1, 'Il cognome è obbligatorio'),
  }),
});

export default function SignupPage() {
  const [sending, setSending] = useState(false);
  const [showPassword, setShowPassword] = useState('password');
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => (prev === 'text' ? 'password' : 'text'));
  };

  const ShowPasswordIcon = (props: LucideProps) => {
    if (showPassword === 'password') {
      return <Eye {...props} className={cn('size-4', props.className)} />;
    }
    return <EyeOff {...props} className={cn('size-4', props.className)} />;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: {
        email: '',
        password: '',
        passwordConfirmation: '',
      },
      profile: {
        firstName: '',
        lastName: '',
      },
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSending(true);
    const formData = new FormData();
    formData.append('email', data.account.email);
    formData.append('password', data.account.password);
    formData.append('firstName', data.profile.firstName);
    formData.append('lastName', data.profile.lastName);

    const error = await signup(formData);

    setSending(false);

    if (error) {
      form.setError('root', {
        type: 'value',
        message: error,
      });
      return;
    }

    redirect('signup/email-verification');
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <Logo className="h-auto w-[16rem]" />
        </div>
        <div className={cn('flex flex-col gap-6')}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Benvenuto/a</CardTitle>
              <CardDescription>
                Crea un account inserendo i tuoi dati
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid gap-6">
                    <div className="grid gap-6">
                      <FormRootMessage />

                      <FormField
                        control={form.control}
                        name="account.email"
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

                      <FormField
                        control={form.control}
                        name="account.password"
                        render={({ field }) => (
                          <FormItem className="grid space-y-3">
                            <FormLabel>Password</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input {...field} type={showPassword} />
                              </FormControl>
                              <ShowPasswordIcon
                                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                onClick={togglePasswordVisibility}
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="account.passwordConfirmation"
                        render={({ field }) => (
                          <FormItem className="grid space-y-3">
                            <FormLabel>Conferma Password</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input {...field} type={showPassword} />
                              </FormControl>
                              <ShowPasswordIcon
                                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                onClick={togglePasswordVisibility}
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="profile.firstName"
                        render={({ field }) => (
                          <FormItem className="grid space-y-3">
                            <FormLabel>Nome</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input {...field} type="text" />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="profile.lastName"
                        render={({ field }) => (
                          <FormItem className="grid space-y-3">
                            <FormLabel>Cognome</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input {...field} type="text" />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={sending}
                      >
                        {sending && <Spinner />}
                        Iscriviti
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>

              <div className="text-muted-foreground text-center text-sm">
                Hai già un account?{' '}
                <Link
                  href="/auth/login"
                  className="text-primary font-medium underline-offset-4 hover:underline"
                >
                  Accedi
                </Link>
              </div>
            </CardContent>
          </Card>
          {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            Cliccando su accedi, accetti i nostri{' '}
            <Link href="#">Termini di servizio</Link> e la nostra{' '}
            <Link href="#">Informativa sulla privacy</Link>.
          </div> */}
        </div>
      </div>
    </div>
  );
}
