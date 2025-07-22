import {
  defaultShouldDehydrateQuery,
  QueryCache,
  QueryClient,
} from '@tanstack/react-query';
import { TRPCClientError } from '@trpc/client';
import SuperJSON from 'superjson';

export const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (
          error instanceof TRPCClientError &&
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          error.data.code === 'UNAUTHORIZED'
        ) {
          window.location.href = `/auth/sign-in?from=${encodeURIComponent(
            window.location.pathname + window.location.search,
          )}`;
        }
      },
    }),
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
        retry(failureCount, error) {
          // Don't retry on unauthorized errors
          if (
            error instanceof TRPCClientError &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            error.data.code === 'UNAUTHORIZED'
          ) {
            return false;
          }
          // Retry all other errors
          return failureCount < 3;
        },
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
        shouldRedactErrors: () => {
          // We should not catch Next.js server errors
          // as that's how Next.js detects dynamic pages
          // so we cannot redact them.
          // Next.js also automatically redacts errors for us
          // with better digests.
          return false;
        },
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
