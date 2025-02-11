import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { getSession } from '@/lib/auth/session';
// import { protectedRoutes } from './routes';

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname } = nextUrl;
  // const sessionCookie = request.cookies.get('session');
  // for now land user on sign-in page
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/sign-in', nextUrl));
  }
  // if (!session) {
  //   return NextResponse.redirect(new URL('/sign-in', nextUrl));
  // }

  return NextResponse.next();
}

// from https://clerk.com/docs/quickstarts/nextjs#add-middleware-to-your-application
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
