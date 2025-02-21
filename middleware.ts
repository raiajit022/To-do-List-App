import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Create a response object that we can modify
  const res = NextResponse.next()
  
  // Initialize Supabase client with the request and response
  const supabase = createMiddlewareClient({ req, res })

  // Get the current session
  const { data: { session } } = await supabase.auth.getSession()

  // Get the current URL path
  const path = req.nextUrl.pathname

  // If user is not logged in and trying to access protected routes
  if (!session && !path.startsWith('/auth')) {
    // Redirect to login page
    const redirectUrl = new URL('/auth/login', req.url)
    // Store the original URL to redirect back after login
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is logged in and trying to access auth pages
  if (session && path.startsWith('/auth')) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

// Run middleware on all routes except public assets
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 