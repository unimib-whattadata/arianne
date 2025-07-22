import { z } from 'zod';

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  // Add `.min(1) on ID and SECRET if you want to make sure they're not empty
  //NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: z.string(),
  // WAZUH_RSYSLOG: z.string(),
  // SYSLOG_PORT: z.string().regex(/^\d+$/).transform(Number),
  // REMOTELOGGER: z.string(),
  CLIENT_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  //NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL: z.string().url(),
  NEXT_PUBLIC_TRPC_LOGGER_ENABLED: z.enum(['true', 'false']).optional(),
  NEXT_PUBLIC_KEYCLOAK_FRONTEND_URL: z.string().url(),
  NEXT_PUBLIC_KEYCLOAK_REALM: z.string(),
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: z.string(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_LANDING_URL: z.string().url(),
  NEXT_PUBLIC_MIROTALK_URL: z.string().url(),
  NEXT_PUBLIC_MIROTALK_API_KEY_SECRET: z.string().min(1),
  // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  NEXT_PUBLIC_KEYCLOAK_REALM: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  NEXT_PUBLIC_KEYCLOAK_FRONTEND_URL:
    process.env.NEXT_PUBLIC_KEYCLOAK_FRONTEND_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_LANDING_URL: process.env.NEXT_PUBLIC_LANDING_URL,
  //NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL: process.env.NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL,
  NEXT_PUBLIC_TRPC_LOGGER_ENABLED: process.env.NEXT_PUBLIC_TRPC_LOGGER_ENABLED,
  // REMOTELOGGER: process.env.REMOTELOGGER,
  // WAZUH_RSYSLOG: process.env.WAZUH_RSYSLOG,
  // SYSLOG_PORT: process.env.SYSLOG_PORT,
  NEXT_PUBLIC_MIROTALK_URL: process.env.NEXT_PUBLIC_MIROTALK_URL,
  NEXT_PUBLIC_MIROTALK_API_KEY_SECRET:
    process.env.NEXT_PUBLIC_MIROTALK_API_KEY_SECRET,
  // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === 'undefined';

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer
      ? merged.safeParse(processEnv) // on server we can validate all env vars
      : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
  );

  if (parsed.success === false) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    );
    throw new Error('Invalid environment variables');
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined;
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith('NEXT_PUBLIC_'))
        throw new Error(
          process.env.NODE_ENV === 'production'
            ? '❌ Attempted to access a server-side environment variable on the client'
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`,
        );
      return target[/** @type {keyof typeof target} */ (prop)];
    },
  });
}

export { env };
