'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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

export async function sendPasswordResetEmail(formData: FormData) {
  const supabase = await createClient(cookies());

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) return getErrorMessage(error);
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient(cookies());

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.updateUser(data);

  if (error) return getErrorMessage(error);

  revalidatePath('/auth/login', 'layout');
  redirect('/auth/login');
}
