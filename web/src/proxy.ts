import { NextResponse, type NextRequest } from 'next/server'

/** English lives at /…  (rewritten internally to /en/…); Bangla lives at /bn/…; /en/… is redirected to /… to avoid duplicate pages. */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.slice(3) || '/'
    return NextResponse.redirect(url, 308)
  }
  const headers = new Headers(req.headers)
  if (pathname === '/bn' || pathname.startsWith('/bn/')) return NextResponse.next({ request: { headers } })
  const url = req.nextUrl.clone()
  url.pathname = '/en' + (pathname === '/' ? '' : pathname)
  return NextResponse.rewrite(url, { request: { headers } })
}

export const config = { matcher: ['/((?!_next|api|admin|.*\\..*).*)'] }
