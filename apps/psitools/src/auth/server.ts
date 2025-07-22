import 'server-only';

import { initAuth } from '@arianne/auth';
import { headers } from 'next/headers';
import { cache } from 'react';

import { env } from '@/env.mjs';

export const auth = initAuth({
  baseURL: env.NEXT_PUBLIC_APP_URL,
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
