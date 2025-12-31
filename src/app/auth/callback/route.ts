import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    
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
