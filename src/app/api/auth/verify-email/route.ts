import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'
import { sendEmailVerificationEmail, sendWelcomeEmail } from '@/lib/email/mailjet'
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from '@/lib/security/rate-limit'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Send verification email
export async function POST(request: Request) {
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(request, 'verifyEmail')
    const rateLimit = checkRateLimit(identifier, RATE_LIMITS.verifyEmail)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.message },
        { 
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfter) }
        }
      )
    }

    const { userId, email, name } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ error: 'User ID and email are required' }, { status: 400 })
    }

    // Generate secure token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Invalidate any existing tokens for this user
    await supabaseAdmin
      .from('email_verification_tokens')
      .delete()
      .eq('user_id', userId)

    // Store the token
    const { error: insertError } = await supabaseAdmin
      .from('email_verification_tokens')
      .insert({
        user_id: userId,
        email: email.toLowerCase(),
        token,
        expires_at: expiresAt.toISOString(),
      })

    if (insertError) {
      console.error('Failed to store verification token:', insertError)
      return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
    }

    // Build verification URL
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

    // Send email via Mailjet
    const emailResult = await sendEmailVerificationEmail({
      email,
      name: name || 'there',
      verificationLink: verificationUrl,
    })

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Verification email sent.' 
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Verify token
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token is required' }, { status: 400 })
    }

    const { data: verificationToken, error } = await supabaseAdmin
      .from('email_verification_tokens')
      .select('*')
      .eq('token', token)
      .is('verified_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !verificationToken) {
      return NextResponse.json({ valid: false, error: 'Invalid or expired token' }, { status: 400 })
    }

    // Mark as verified
    await supabaseAdmin
      .from('email_verification_tokens')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', verificationToken.id)

    // Update user's email_verified status
    const { data: profile } = await supabaseAdmin
      .from('users')
      .update({ email_verified: true })
      .eq('id', verificationToken.user_id)
      .select('full_name, email')
      .single()

    // Also update auth.users email_confirmed_at
    await supabaseAdmin.auth.admin.updateUserById(
      verificationToken.user_id,
      { email_confirm: true }
    )

    // Send welcome email now that user is verified
    if (profile) {
      sendWelcomeEmail({
        email: profile.email,
        name: profile.full_name || 'there',
      }).catch(err => console.error('Failed to send welcome email:', err))
    }

    return NextResponse.json({ 
      valid: true, 
      message: 'Email verified successfully' 
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({ valid: false, error: 'Internal server error' }, { status: 500 })
  }
}
