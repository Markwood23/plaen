import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email/mailjet'
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from '@/lib/security/rate-limit'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(request, 'forgotPassword')
    const rateLimit = checkRateLimit(identifier, RATE_LIMITS.forgotPassword)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.message },
        { 
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfter) }
        }
      )
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if user exists
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name')
      .eq('email', email.toLowerCase())
      .single()

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: 'If an account exists with this email, you will receive a password reset link.' 
      })
    }

    // Generate secure token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Invalidate any existing tokens for this email
    await supabaseAdmin
      .from('password_reset_tokens')
      .delete()
      .eq('email', email.toLowerCase())

    // Store the token
    const { error: insertError } = await supabaseAdmin
      .from('password_reset_tokens')
      .insert({
        email: email.toLowerCase(),
        token,
        expires_at: expiresAt.toISOString(),
      })

    if (insertError) {
      console.error('Failed to store reset token:', insertError)
      return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
    }

    // Build reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

    // Send email via Mailjet
    const emailResult = await sendPasswordResetEmail({
      email: user.email,
      name: user.full_name || 'there',
      resetLink: resetUrl,
    })

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error)
      // Still return success to prevent enumeration, but log the error
    }

    return NextResponse.json({ 
      success: true, 
      message: 'If an account exists with this email, you will receive a password reset link.' 
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
