import { env } from '@/env.mjs';

/**
 * @see https://docs.mirotalk.com/mirotalk-p2p/api/#direct-join-entry-point for direct join entry point
 */

export const generateMeetingLink = async () => {
  try {
    const response = (await fetch(env.NEXT_PUBLIC_MIROTALK_URL, {
      method: 'POST',
      headers: {
        authorization: env.NEXT_PUBLIC_MIROTALK_API_KEY_SECRET,
        'Content-Type': 'application/json',
      },
    })) as unknown as Response;

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as { meeting: string };

    return { data: data.meeting, error: null };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
