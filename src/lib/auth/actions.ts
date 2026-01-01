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
  const accountType = formData.get('account_type') as string || 'personal'
  const phone = formData.get('phone') as string || null
  const country = formData.get('country') as string || null
  const invoicePrefix = formData.get('invoice_prefix') as string || 'GH'

  // Create user without email confirmation (we'll handle it ourselves)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        business_name: businessName,
      },
      // Don't use Supabase email redirect - we'll send our own verification email
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
              account_type: accountType,
              phone: phone,
              invoice_prefix: invoicePrefix.toUpperCase().slice(0, 2), // Ensure 2 char prefix
              setup_completed: false,
              email_verified: false,
            },
            { onConflict: 'id' }
          )
        
        // Set address if country is provided
        if (country) {
          await service
            .from('users')
            .update({ address: { country } })
            .eq('id', data.user.id)
        }
      }
    } catch (e) {
      console.error('Error ensuring user profile (service role):', e)
    }
  }

  // If email confirmation is required
  if (data?.user && !data.session) {
    return { 
      success: true, 
      message: 'Please check your email to confirm your account.',
      userId: data.user.id
    }
  }

  // Create user profile (if not already done via service client)
  if (data?.user) {
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName,
        business_name: businessName,
        account_type: accountType,
        phone: phone,
        invoice_prefix: invoicePrefix.toUpperCase().slice(0, 2),
        setup_completed: false,
      }, { onConflict: 'id' })

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

// Note: Password reset is now handled via API routes:
// - /api/auth/forgot-password (request reset)
// - /api/auth/reset-password (verify token + update password)
// These use custom email templates via Mailjet instead of Supabase's built-in emails.

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
