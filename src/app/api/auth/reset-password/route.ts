import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendPasswordChangedEmail } from '@/lib/email/mailjet'
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from '@/lib/security/rate-limit'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Verify token is valid
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token is required' }, { status: 400 })
    }

    const { data: resetToken, error } = await supabaseAdmin
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !resetToken) {
      return NextResponse.json({ valid: false, error: 'Invalid or expired token' }, { status: 400 })
    }

    return NextResponse.json({ valid: true, email: resetToken.email })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({ valid: false, error: 'Internal server error' }, { status: 500 })
  }
}

// Reset password with token
export async function POST(request: Request) {
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(request, 'resetPassword')
    const rateLimit = checkRateLimit(identifier, RATE_LIMITS.resetPassword)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.message },
        { 
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfter) }
        }
      )
    }

    const { token, password } = await request.json()
    
    // Get IP address for security logging
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'Unknown'

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json({ error: 'Password must contain at least one uppercase letter' }, { status: 400 })
    }
    if (!/\d/.test(password)) {
      return NextResponse.json({ error: 'Password must contain at least one number' }, { status: 400 })
    }

    // Verify token
    const { data: resetToken, error: tokenError } = await supabaseAdmin
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (tokenError || !resetToken) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    // Check if new password is same as current password
    // Try to sign in with the new password - if it works, password is the same
    const { error: loginError } = await supabaseAdmin.auth.signInWithPassword({
      email: resetToken.email,
      password: password,
    })
    
    if (!loginError) {
      // Password worked, meaning it's the same as current password
      return NextResponse.json({ 
        error: 'New password cannot be the same as your current password' 
      }, { status: 400 })
    }

    // Get user by email from auth.users
    const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers()
    const user = users?.find(u => u.email?.toLowerCase() === resetToken.email.toLowerCase())

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's profile for name
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('full_name')
      .eq('id', user.id)
      .single()

    // Update password using admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password }
    )

    if (updateError) {
      console.error('Failed to update password:', updateError)
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
    }

    // Mark token as used
    await supabaseAdmin
      .from('password_reset_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', resetToken.id)

    // Send password changed security alert
    sendPasswordChangedEmail({
      email: resetToken.email,
      name: profile?.full_name || undefined,
      ipAddress,
      timestamp: new Date(),
    }).catch(err => console.error('Failed to send password changed email:', err))

    return NextResponse.json({ success: true, message: 'Password updated successfully' })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
