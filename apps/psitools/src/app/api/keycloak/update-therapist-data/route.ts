import { updateKeycloakUser } from '@/utils/keycloak';

interface TrequestBody {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

export async function PUT(request: Request) {
  const body = (await request.json()) as TrequestBody;

  try {
    const response = await updateKeycloakUser(body);

    if (!response.ok) {
      return Response.json({
        success: false,
        status: response.status,
        error: response.statusText,
      });
    }

    if (response.status === 204) {
      return Response.json({
        success: true,
        status: 'user updated',
        error: null,
      });
    }

    return Response.json({
      success: false,
      status: response.status,
      error: response.statusText,
    });
  } catch (error) {
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
