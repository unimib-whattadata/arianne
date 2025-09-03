'use client';

import type { AppRouter } from '@arianne/api';
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  createTRPCClient,
  createWSClient,
  httpBatchStreamLink,
  loggerLink,
  splitLink,
  wsLink,
} from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import SuperJSON from 'superjson';

import { createQueryClient } from './query-client';
import { createClient } from '@arianne/supabase/client';
import { env } from '@/env.mjs';

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient());
  }
};

export const { useTRPC, TRPCProvider, useTRPCClient } =
  createTRPCContext<AppRouter>();

const getBaseUrl = (wss?: boolean) => {
  if (wss) return 'ws://localhost:3005';
  if (typeof window !== 'undefined') return window.location.origin;

  return env.NEXT_PUBLIC_APP_URL;

  //return `http://localhost:${process.env.PORT ?? 3000}`;
};

const wsClient = createWSClient({
  url: getBaseUrl(true),
  connectionParams: async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('WebSocket connection error:', error);
      return { error: error.message };
    }
    console.log('WebSocket connection session:', data);
    return {
      session: JSON.stringify(data),
    };
  },
});

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (opts) =>
            // eslint-disable-next-line no-restricted-properties
            (process.env.NODE_ENV === 'development' &&
              typeof window !== 'undefined') ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        splitLink({
          condition: (op) => op.type === 'subscription',
          true: wsLink({
            transformer: SuperJSON,
            client: wsClient,
          }),
          false: httpBatchStreamLink({
            transformer: SuperJSON,
            url: getBaseUrl() + '/api/trpc',
            headers() {
              const headers = new Headers();
              headers.set('x-trpc-source', 'nextjs-react');
              return headers;
            },
          }),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
