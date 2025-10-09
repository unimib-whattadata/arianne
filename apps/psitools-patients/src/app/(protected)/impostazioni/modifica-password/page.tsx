'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function PasswordPage() {
  return (
    <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="bg-background sticky top-0 z-10 pb-3">
        <h1 className="text-xl font-semibold">Modifica password</h1>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <h2 className="text-lg font-medium">Cambia la tua password</h2>
          <p>
            Ti invieremo un'email per confermare la modifica della password.
          </p>
        </CardHeader>
        <CardContent>
          <Button variant="default">
            Invia email per il reset della password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
