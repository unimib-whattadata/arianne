import type { AppRouter } from '@arianne/api';
import { appRouter, createCallerFactory, createTRPCContext } from '@arianne/api';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { TRPCQueryOptions } from '@trpc/tanstack-react-query';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { headers } from 'next/headers';
import { cache } from 'react';

import { auth } from '@/auth/server';

import { createQueryClient } from './query-client';

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set('x-trpc-source', 'rsc');

  return createTRPCContext({
    auth,
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);

export const trpc = createTRPCOptionsProxy<AppRouter>({
  router: appRouter,
  ctx: createContext,
  queryClient: getQueryClient,
});

const createCaller = createCallerFactory(appRouter);
export const api = createCaller(createContext);

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}

// const handler = applyWSSHandler({
//   wss: wss,
//   router: appRouter,
//   createContext,
//   // Enable heartbeat messages to keep connection open (disabled by default)
//   keepAlive: {
//     enabled: true,
//     // server ping message interval in milliseconds
//     pingMs: 30000,
//     // connection is terminated if pong message is not received in this many milliseconds
//     pongWaitMs: 5000,
//   },
// });

// process.on('SIGTERM', () => {
//   console.log('SIGTERM');
//   handler.broadcastReconnectNotification();
//   wss.close();
// });
