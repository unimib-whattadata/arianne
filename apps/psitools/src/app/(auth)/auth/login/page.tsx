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
import { login } from './actions';
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

const formSchema = z.object({
  email: z.string().email('Inserisci un indirizzo email valido'),
  password: z.string().min(6, 'La password deve contenere almeno 6 caratteri'),
});

export default function LoginPage() {
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
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    const error = await login(formData);

    if (error) {
      form.setError('root', {
        type: 'value',
        message: error,
      });
      return;
    }

    redirect('/'); // redirect to protected area on success
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
                Accedi con il tuo account Apple o Google
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid gap-6">
                    <div className="flex flex-col gap-4">
                      <Button variant="outline" className="w-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                            fill="currentColor"
                          />
                        </svg>
                        Accedi con Apple
                      </Button>
                      <Button variant="outline" className="w-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                        Accedi con Google
                      </Button>
                    </div>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                      <span className="bg-card text-muted-foreground relative z-10 px-2">
                        O continua con
                      </span>
                    </div>
                    <div className="grid gap-6">
                      <FormRootMessage />

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

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="grid space-y-3">
                            <div className="flex items-center">
                              <FormLabel>Password</FormLabel>
                              <Link
                                href="/auth/password-recovery"
                                className="ml-auto text-sm underline-offset-4 hover:underline"
                              >
                                Hai dimenticato la password?
                              </Link>
                            </div>
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

                      <Button type="submit" className="w-full">
                        Accedi
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>

              <div className="text-muted-foreground text-center text-sm">
                Non hai un account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-primary font-medium underline-offset-4 hover:underline"
                >
                  Iscriviti
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
