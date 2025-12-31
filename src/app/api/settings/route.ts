import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/settings - Get user settings
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user profile with settings
    const { data: profile, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (fetchError) {
      console.error('Error fetching settings:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
    
    // Return structured settings combining profile fields and settings JSONB
    const settings = {
      // Profile info
      email: user.email,
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      
      // Business info
      business_name: profile?.business_name || '',
      address: profile?.address || {},
      logo_url: profile?.logo_url || '',
      
      // Invoice defaults
      default_currency: profile?.default_currency || 'GHS',
      default_payment_terms: profile?.default_payment_terms || 14,
      
      // Payment methods
      bank_details: profile?.bank_details || [],
      mobile_money_details: profile?.mobile_money_details || [],
      crypto_wallets: profile?.crypto_wallets || [],
      
      // Extended settings from JSONB (cast settings to object type)
      notifications: (profile?.settings as Record<string, unknown> | null)?.notifications || {
        invoice_paid: true,
        payment_received: true,
        invoice_overdue: true,
        weekly_report: false,
        monthly_report: true,
        reminders_sent: true,
        new_customer: false,
      },
      invoice_settings: (profile?.settings as Record<string, unknown> | null)?.invoice_settings || {
        on_time_threshold_days: 3,
        auto_reminders: true,
        default_tax_rate: 0,
        late_fee_enabled: false,
        late_fee_percent: 0,
      },
      branding: (profile?.settings as Record<string, unknown> | null)?.branding || {
        accent_color: '#6366f1',
        theme: 'light',
      },
      payment_methods: (profile?.settings as Record<string, unknown> | null)?.payment_methods || {
        flutterwave_enabled: false,
        paystack_enabled: false,
        bank_transfer_enabled: true,
        momo_enabled: true,
        crypto_enabled: false,
      },
    }
    
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/settings - Update user settings
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    
    // Get current profile to merge settings
    const { data: currentProfile } = await supabase
      .from('users')
      .select('settings')
      .eq('id', user.id)
      .single()
    
    // Build update data for direct columns
    const directUpdate: Record<string, unknown> = {}
    
    // Profile fields
    if (body.full_name !== undefined) directUpdate.full_name = body.full_name
    if (body.phone !== undefined) directUpdate.phone = body.phone
    if (body.business_name !== undefined) directUpdate.business_name = body.business_name
    if (body.address !== undefined) directUpdate.address = body.address
    if (body.logo_url !== undefined) directUpdate.logo_url = body.logo_url
    if (body.default_currency !== undefined) directUpdate.default_currency = body.default_currency
    if (body.default_payment_terms !== undefined) directUpdate.default_payment_terms = body.default_payment_terms
    
    // Payment details (stored in dedicated JSONB columns)
    if (body.bank_details !== undefined) directUpdate.bank_details = body.bank_details
    if (body.mobile_money_details !== undefined) directUpdate.mobile_money_details = body.mobile_money_details
    if (body.crypto_wallets !== undefined) directUpdate.crypto_wallets = body.crypto_wallets
    
    // Extended settings (merge into settings JSONB)
    const currentSettings = (currentProfile?.settings as Record<string, unknown> | null) || {}
    let newSettings: Record<string, unknown> = { ...currentSettings }
    let hasSettingsChange = false
    
    if (body.notifications !== undefined) {
      newSettings.notifications = { ...(currentSettings.notifications as Record<string, unknown> || {}), ...body.notifications }
      hasSettingsChange = true
    }
    if (body.invoice_settings !== undefined) {
      newSettings.invoice_settings = { ...(currentSettings.invoice_settings as Record<string, unknown> || {}), ...body.invoice_settings }
      hasSettingsChange = true
    }
    if (body.branding !== undefined) {
      newSettings.branding = { ...(currentSettings.branding as Record<string, unknown> || {}), ...body.branding }
      hasSettingsChange = true
    }
    if (body.payment_methods !== undefined) {
      newSettings.payment_methods = { ...(currentSettings.payment_methods as Record<string, unknown> || {}), ...body.payment_methods }
      hasSettingsChange = true
    }
    
    if (hasSettingsChange) {
      directUpdate.settings = newSettings
    }
    
    // Only update if there's something to update
    if (Object.keys(directUpdate).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }
    
    // Update the user profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from('users')
      .update(directUpdate)
      .eq('id', user.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('Error updating settings:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
    
    // Return updated settings in same format as GET
    const updatedSettings = updatedProfile?.settings as Record<string, unknown> | null
    const settings = {
      email: user.email,
      full_name: updatedProfile?.full_name || '',
      phone: updatedProfile?.phone || '',
      business_name: updatedProfile?.business_name || '',
      address: updatedProfile?.address || {},
      logo_url: updatedProfile?.logo_url || '',
      default_currency: updatedProfile?.default_currency || 'GHS',
      default_payment_terms: updatedProfile?.default_payment_terms || 14,
      bank_details: updatedProfile?.bank_details || [],
      mobile_money_details: updatedProfile?.mobile_money_details || [],
      crypto_wallets: updatedProfile?.crypto_wallets || [],
      notifications: updatedSettings?.notifications || {},
      invoice_settings: updatedSettings?.invoice_settings || {},
      branding: updatedSettings?.branding || {},
      payment_methods: updatedSettings?.payment_methods || {},
    }
    
    return NextResponse.json({ 
      success: true,
      settings
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
