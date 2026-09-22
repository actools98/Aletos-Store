import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-change-me')

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('aletos_session')?.value
    if (!token) return NextResponse.redirect(new URL('/admin/login', req.url))
    try { await jwtVerify(token, SECRET) }
    catch { return NextResponse.redirect(new URL('/admin/login', req.url)) }
  }
  return NextResponse.next()
}
export const config = { matcher: ['/admin/:path*'] }
