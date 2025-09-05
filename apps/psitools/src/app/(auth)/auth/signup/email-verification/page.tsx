export default function EmailVerificationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Verifica la tua email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ti abbiamo inviato un'email di verifica. Controlla la tua casella di
            posta e segui il link per completare la registrazione.
          </p>
        </div>
      </div>
    </div>
  );
}
