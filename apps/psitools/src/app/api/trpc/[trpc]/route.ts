import { appRouter, createTRPCContext } from '@arianne/api';
import { createClient } from '@arianne/supabase/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (res: Response) => {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Request-Method', '*');
  res.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.headers.set('Access-Control-Allow-Headers', '*');
};

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
};

const handler = async (req: NextRequest) => {
  const supabase = await createClient(cookies());
  const user = await supabase.auth.getUser();

  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    router: appRouter,
    req,
    createContext: () =>
      createTRPCContext({
        user,
        headers: req.headers,
      }),
    onError({ error, path }) {
      console.error(
        `>>> tRPC Error on '${path}'\nCode: ${error.code}\nMessage: ${error.message}\n`,
      );
    },
  });

  setCorsHeaders(response);
  return response;
};

export { handler as GET, handler as POST };
