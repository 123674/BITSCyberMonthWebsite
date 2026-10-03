import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE, isValidAdminSession } from '@/lib/adminAuth'

const LOGIN_PATH = '/admin/login'

// Send anyone who isn't logged in to the admin login page.
// The event-saving server actions re-check the session themselves.
export async function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl
    if (pathname === LOGIN_PATH) return NextResponse.next()

    if (await isValidAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)) {
        return NextResponse.next()
    }

    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set('next', pathname + search)
    return NextResponse.redirect(loginUrl)
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
}
