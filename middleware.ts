import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getEnv } from '@/lib/env'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        getEnv('NEXT_PUBLIC_SUPABASE_URL'),
        getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // 1. Protect Private Routes
    if (!user && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/onboarding'))) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. Prevent logged-in users from seeing the login page
    if (user && request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: ['/dashboard/:path*', '/onboarding', '/login'],
}