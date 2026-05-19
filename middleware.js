import { NextResponse } from 'next/server'

export function middleware(request) {
  // Redirect root to index.html
  if (request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/index.html', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
