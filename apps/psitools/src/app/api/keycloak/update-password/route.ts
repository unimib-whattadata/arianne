import { updatePassword } from '@/utils/keycloak';

export async function PUT(request: Request) {
  const body = (await request.json()) as { id: string; username: string };

  try {
    const response = await updatePassword(body);

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
        status: 'Password updated',
        error: null,
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
