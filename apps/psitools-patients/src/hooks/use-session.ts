import { authClient } from '@/auth/client';

export function useSession() {
  const { data: session, isPending: loading } = authClient.useSession();

  return { session, loading };
}
