import type { NextRequest } from 'next/server';
import { updateSession } from '@arianne/supabase/middleware';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/', '/((?!api|auth|_next/static|_next/image|favicon.ico).*)'],
};
