import { getSessionCookie } from 'better-auth/cookies';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/((?!api|auth|_next/static|_next/image|favicon.ico).*)'],
};
