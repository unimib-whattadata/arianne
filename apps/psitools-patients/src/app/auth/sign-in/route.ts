import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';

import { auth } from '@/auth/server';

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get('from') || '/';
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const res = await auth.api.signInWithOAuth2({
      body: {
        providerId: 'keycloak',
        callbackURL: from,
      },
    });
    if (res.url) {
      return Response.redirect(res.url, 302);
    }
  }

  return Response.json(
    {
      message: 'Already signed in',
      session,
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
