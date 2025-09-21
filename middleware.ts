import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  // Handle OPTIONS requests for CORS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers })
  }

  // Rate limiting for API routes (basic implementation)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || 'unknown'
    const rateLimitKey = `rate_limit_${ip}`
    
    // This is a basic rate limiting - in production you'd use Redis or similar
    // For now, we'll just add a header to track requests
    response.headers.set('X-RateLimit-IP', ip)
  }

  // Block potentially malicious requests
  const userAgent = request.headers.get('user-agent') || ''
  if (userAgent.includes('bot') && userAgent.includes('scraper')) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
