import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendLoginAlertEmail } from '@/lib/email/mailjet'
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from '@/lib/security/rate-limit'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(request, 'login')
    const rateLimit = checkRateLimit(identifier, RATE_LIMITS.login)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.message },
        { 
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfter) }
        }
      )
    }

    const { email, password } = await request.json()
    
    // Get request metadata for security logging
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'Unknown'
    const userAgent = request.headers.get('user-agent') || 'Unknown'

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Attempt sign in
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Log failed attempt (could be expanded to track brute force attempts)
      console.log(`Failed login attempt for ${email} from IP ${ipAddress}`)
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (!data.user || !data.session) {
      return NextResponse.json({ error: 'Login failed' }, { status: 401 })
    }

    // Get user's profile for name
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('full_name')
      .eq('id', data.user.id)
      .single()

    // Send login alert email (async, don't block response)
    sendLoginAlertEmail({
      email: data.user.email!,
      name: profile?.full_name || undefined,
      ipAddress,
      userAgent,
      timestamp: new Date(),
    }).catch(err => console.error('Failed to send login alert email:', err))

    // Return session data
    return NextResponse.json({ 
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
