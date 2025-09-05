'use client';

import type { LucideProps } from 'lucide-react';
import { Eye, EyeOff, GalleryVerticalEnd } from 'lucide-react';
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
import { resetPassword } from '@/app/(auth)/auth/password-recovery/actions';
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
import Link from 'next/link';
import { useState } from 'react';

interface ShowPasswordIconProps extends LucideProps {
  field: 'password' | 'confirmPassword';
}

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, 'La password deve contenere almeno 6 caratteri'),
    confirmPassword: z
      .string()
      .min(6, 'La password deve contenere almeno 6 caratteri'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Le password non corrispondono',
    path: ['root'],
  });

export default function PasswordRecoveryPage() {
  const [showPassword, setShowPassword] = useState({
    password: 'password',
    confirmPassword: 'password',
  });
  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: prev[field] === 'text' ? 'password' : 'text',
    }));
  };

  const ShowPasswordIcon = (props: ShowPasswordIconProps) => {
    if (showPassword[props.field] === 'password') {
      return <Eye {...props} className={cn('size-4', props.className)} />;
    }
    return <EyeOff {...props} className={cn('size-4', props.className)} />;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', data);

    const formData = new FormData();
    formData.append('password', data.password);

    const error = await resetPassword(formData);

    if (error) {
      form.setError('root', {
        type: 'value',
        message: error,
      });
    }
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

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="grid space-y-3">
                          <div className="flex items-center">
                            <FormLabel>Password</FormLabel>
                            <Link
                              href="#"
                              className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                              Hai dimenticato la password?
                            </Link>
                          </div>
                          <div className="relative">
                            <FormControl>
                              <Input {...field} type={showPassword.password} />
                            </FormControl>
                            <ShowPasswordIcon
                              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                              onClick={() =>
                                togglePasswordVisibility('password')
                              }
                              field="password"
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="grid space-y-3">
                          <div className="flex items-center">
                            <FormLabel>Password</FormLabel>
                            <Link
                              href="#"
                              className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                              Hai dimenticato la password?
                            </Link>
                          </div>
                          <div className="relative">
                            <FormControl>
                              <Input
                                {...field}
                                type={showPassword.confirmPassword}
                              />
                            </FormControl>
                            <ShowPasswordIcon
                              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                              onClick={() =>
                                togglePasswordVisibility('confirmPassword')
                              }
                              field="confirmPassword"
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Aggiorna la password
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            Cliccando su accedi, accetti i nostri{' '}
            <Link href="#">Termini di servizio</Link> e la nostra{' '}
            <Link href="#">Informativa sulla privacy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
