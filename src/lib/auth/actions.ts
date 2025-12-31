'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { sendWelcomeEmail, isEmailConfigured } from '@/lib/email/mailjet'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createServiceClient(url, key)
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const businessName = formData.get('business_name') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        business_name: businessName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Always ensure a corresponding public.users profile row exists.
  // This is critical when email confirmation is enabled (no session on signUp).
  if (data?.user) {
    try {
      const service = getServiceClient()
      if (service) {
        await service
          .from('users')
          .upsert(
            {
              id: data.user.id,
              email: data.user.email!,
              full_name: fullName || null,
              business_name: businessName || null,
            },
            { onConflict: 'id' }
          )
      }
    } catch (e) {
      console.error('Error ensuring user profile (service role):', e)
    }
  }

  // If email confirmation is required
  if (data?.user && !data.session) {
    return { 
      success: true, 
      message: 'Please check your email to confirm your account.' 
    }
  }

  // Create user profile
  if (data?.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName,
        business_name: businessName,
      })

    if (profileError) {
      console.error('Error creating user profile:', profileError)
    }

    // Send welcome email
    if (isEmailConfigured() && data.user.email) {
      sendWelcomeEmail({
        email: data.user.email,
        name: fullName || 'there',
      }).catch(err => console.error('Failed to send welcome email:', err))
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()

  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { 
    success: true, 
    message: 'Password reset link sent to your email.' 
  }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const updates: Record<string, unknown> = {}
  
  const fullName = formData.get('full_name')
  const businessName = formData.get('business_name')
  const phone = formData.get('phone')
  const defaultCurrency = formData.get('default_currency')
  const defaultPaymentTerms = formData.get('default_payment_terms')

  if (fullName !== null) updates.full_name = fullName
  if (businessName !== null) updates.business_name = businessName
  if (phone !== null) updates.phone = phone
  if (defaultCurrency !== null) updates.default_currency = defaultCurrency
  if (defaultPaymentTerms !== null) updates.default_payment_terms = Number(defaultPaymentTerms)

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true, message: 'Profile updated successfully.' }
}

export async function getUser() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return null
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    ...user,
    profile,
  }
}
