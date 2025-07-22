import { clientConfig } from '@arianne/auth';

import { env } from '@/env.mjs';

const host = env.NEXT_PUBLIC_KEYCLOAK_FRONTEND_URL;
const realm = env.NEXT_PUBLIC_KEYCLOAK_REALM;
const redirecUri = env.NEXT_PUBLIC_APP_URL;
const afterVerifyEmailUri = env.NEXT_PUBLIC_LANDING_URL;

const endpoint = {
  token: `${host}realms/${realm}/protocol/openid-connect/token`,
  user: `${host}admin/realms/${realm}/users`,
};

export function generateUniqueId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `P${year}-${randomNum}`;
}

export interface KeycloakUser {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
  attributes: {
    phoneNumber: string | null | undefined;
  };
  requiredActions: string[];
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

  if (!user.username) {
    user.username = generateUniqueId();
  }

  return fetch(endpoint.user, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function sendEmailToUser(
  id: string,
  username: string,
): Promise<Response> {
  const accessToken = await getAccessToken();

  const body = ['VERIFY_EMAIL', 'UPDATE_PASSWORD'];
  const searchParams = new URLSearchParams();

  searchParams.set('redirect_uri', afterVerifyEmailUri);
  searchParams.set('client_id', clientConfig.client_id);
  searchParams.set('username', username);

  return fetch(`${endpoint.user}/${id}/execute-actions-email?${searchParams}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function getKeycloakUser(username: string): Promise<{
  user: KeycloakUser & { id: string };
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

  const user = (await response.json()) as (KeycloakUser & { id: string })[];
  return { user: user[0] };
}

export const updateKeycloakUser = async ({
  id,
  firstName,
  lastName,
  phone,
  email,
}: {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}) => {
  return fetch(`${endpoint.user}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      attributes: {
        phoneNumber: phone,
      },
    }),
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      'Content-Type': 'application/json',
    },
  });
};

export async function updatePassword({
  id,
  username,
}: {
  id: string;
  username: string;
}): Promise<Response> {
  const accessToken = await getAccessToken();

  const body = ['UPDATE_PASSWORD'];
  const searchParams = new URLSearchParams();

  searchParams.set('redirect_uri', redirecUri);
  searchParams.set('client_id', clientConfig.client_id);
  searchParams.set('username', username);

  return fetch(`${endpoint.user}/${id}/execute-actions-email?${searchParams}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
}
