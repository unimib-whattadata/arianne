import { keycloakPluginClient } from '@arianne/supabase';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import type { auth } from '@/auth/server';

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), keycloakPluginClient()],
});
