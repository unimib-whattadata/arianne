import { Logo } from '@/components/brand';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EmailVerificationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Logo className="mx-auto h-auto w-[16rem]" />
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Verifica la tua email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ti abbiamo inviato un'email di verifica. Controlla la tua casella di
            posta e segui il link per completare la registrazione.
          </p>
        </div>
        <div className="flex w-full justify-center">
          <Button asChild>
            <Link href="/auth/login">Torna al login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
