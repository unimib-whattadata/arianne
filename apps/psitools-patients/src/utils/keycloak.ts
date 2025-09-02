import { env } from '@/env.mjs';

const host = env.NEXT_PUBLIC_KEYCLOAK_FRONTEND_URL;
const realm = env.NEXT_PUBLIC_KEYCLOAK_REALM;

const endpoint = {
  token: `${host}realms/${realm}/protocol/openid-connect/token`,
  user: `${host}admin/realms/${realm}/users`,
};

export interface KeycloakUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
  attributes: {
    phone: string | null | undefined;
  };
  credentials: {
    type: string;
    temporary: boolean;
    value: string;
  }[];
  groups: string[];
  username?: string;
}

export async function getAccessToken(): Promise<string> {
  const response = await fetch(endpoint.token, {
    method: 'POST',
    body: new URLSearchParams({
      client_id: 'mapseh-client',
      grant_type: 'client_credentials',
      client_secret: env.CLIENT_SECRET,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch access token');
  }

  const tokenSetJSON = (await response.json()) as { access_token: string };
  return tokenSetJSON.access_token;
}

export async function createKeycloakUser(
  user: KeycloakUser,
): Promise<Response> {
  const accessToken = await getAccessToken();

  return fetch(endpoint.user, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function getKeycloakUser(username: string): Promise<{
  user: KeycloakUser;
}> {
  const accessToken = await getAccessToken();

  const response = await fetch(`${endpoint.user}?username=${username}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(response);
    throw new Error('Failed to fetch user');
  }

  const user = (await response.json()) as KeycloakUser[];
  return { user: user[0] };
}

export const updatePassword = async ({
  id,
  password,
}: {
  id: string;
  password: string;
}) => {
  const accessToken = await getAccessToken();
  const body = { type: 'password', temporary: true, value: password };

  return fetch(`${endpoint.user}/${id}/reset-password`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
};
