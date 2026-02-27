import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // Protected routes - any route starting with /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Redirect to login if no token
      const url = new URL('/login', request.url)
      return NextResponse.redirect(url)
    }
  }

  // If user is logged in, don't let them go to /login again
  if (pathname === '/login' && token) {
    const url = new URL('/dashboard', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
