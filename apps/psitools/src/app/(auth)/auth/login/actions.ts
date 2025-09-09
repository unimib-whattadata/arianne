'use server';

import { cookies } from 'next/headers';

import { createClient } from '@arianne/supabase/server';
import type { AuthError } from '@supabase/auth-js';

const getErrorMessage = (error: AuthError) => {
  switch (error.code) {
    case 'invalid_credentials':
      return 'Credenziali non valide|Controlla email e password';
    case 'user_not_found':
      return 'Utente non trovato|Assicurati di aver creato un account.';
    case 'email_not_confirmed':
      return 'Email non confermata|Controlla la tua casella di posta.';
    case 'password_too_short':
      return 'Password troppo corta|La password deve contenere almeno 6 caratteri.';
    case 'email_already_exists':
      return "L'email è già in uso|Prova a effettuare il login o a utilizzare un'altra email.";
    case 'network_error':
    default:
      return 'Oooops!|Si è verificato un errore durante il login. Riprova più tardi.';
  }
};

export async function login(formData: FormData) {
  const supabase = await createClient(cookies());

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) return getErrorMessage(error);
}
