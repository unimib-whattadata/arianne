import { env } from '@/env.mjs';
import type { AppRouter } from '@arianne/api';
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client';
import superjson from 'superjson';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin;

  return env.NEXT_PUBLIC_APP_URL;
};

export const trpc = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        // eslint-disable-next-line no-restricted-properties
        (process.env.NODE_ENV === 'development' &&
          typeof window !== 'undefined') ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});
