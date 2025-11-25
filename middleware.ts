import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Extract parish slug from path and set header
  const path = request.nextUrl.pathname
  const match = path.match(/^\/p\/([^\/]+)/)
  
  if (match) {
    const slug = match[1]
    // Query parishes table to get parish_id
    const { data: parish } = await supabase
      .from('parishes')
      .select('id')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    
    if (parish) {
      // Set parish_id in header for downstream use
      request.headers.set('x-parish-id', parish.id)
      response.headers.set('x-parish-id', parish.id)
    }
  }

  // Protect admin routes
  if (!user && path.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (user && (path === '/login' || path === '/signup' || path === '/auth/login' || path === '/auth/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

