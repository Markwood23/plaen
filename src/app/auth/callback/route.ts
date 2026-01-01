import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  const supabase = await createClient()

  // Handle token-based auth (email confirmation, password recovery)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'signup' | 'recovery' | 'email',
    })

    if (!error) {
      // For password recovery, redirect to reset password page
      if (type === 'recovery') {
        return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
      }
      
      // For email confirmation, redirect to login with success message
      if (type === 'signup' || type === 'email') {
        return NextResponse.redirect(new URL('/login?verified=true', requestUrl.origin))
      }
      
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
    
    // Error handling
    return NextResponse.redirect(new URL('/login?error=verification_failed', requestUrl.origin))
  }

  // Handle code-based auth (OAuth, magic link)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      // Check if user profile exists
      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single()
      
      // Create user profile if it doesn't exist
      if (!profile) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: data.user.user_metadata?.full_name,
          business_name: data.user.user_metadata?.business_name,
        })
      }
      
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // Return to login page if there's an error
  return NextResponse.redirect(new URL('/login?error=auth', requestUrl.origin))
}
