import type { User } from '@arianne/db';

import type { KeycloakUser } from '@/utils/keycloak';
import { createKeycloakUser, getKeycloakUser } from '@/utils/keycloak';

export async function POST(request: Request) {
  const body = (await request.json()) as User;

  const user: KeycloakUser = {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    emailVerified: true,
    enabled: true,
    attributes: {
      phone: body.phone,
    },
    credentials: [
      {
        type: 'password',
        temporary: true,
        value: 'password',
      },
    ],
    groups: ['/patient'],
    username: body.username ?? undefined,
  };

  try {
    const response = await createKeycloakUser(user);

    if (!response.ok) {
      return Response.json({
        success: false,
        status: response.status,
        error: response.statusText,
      });
    }

    const { user: keycloakUser } = await getKeycloakUser(user.username!);

    if (response.statusText === 'Created') {
      return Response.json({
        success: true,
        status: 'Created',
        user: keycloakUser,
      });
    }

    return Response.json({
      success: false,
      status: 500,
      error: 'Unknown error',
    });
  } catch (error) {
    console.error({ error });

    if (error instanceof Error) {
      const { message, name } = error;
      return Response.json({ success: false, status: name, error: message });
    }

    return Response.json({
      success: false,
      status: 500,
      error: 'Unknown error',
    });
  }
}
