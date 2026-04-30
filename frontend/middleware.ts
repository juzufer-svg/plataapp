import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /login and /register to /auth/login and /auth/register
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  if (pathname === '/register') {
    return NextResponse.redirect(new URL('/auth/register', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register'],
}
