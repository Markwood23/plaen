"use client"

import { useState, useEffect, useCallback } from 'react'

// Types for settings
export interface NotificationSettings {
  invoice_paid: boolean
  payment_received: boolean
  invoice_overdue: boolean
  weekly_report: boolean
  monthly_report: boolean
  reminders_sent: boolean
  new_customer: boolean
}

export interface InvoiceSettings {
  on_time_threshold_days: number
  auto_reminders: boolean
  default_tax_rate: number
  late_fee_enabled: boolean
  late_fee_percent: number
}

export interface BrandingSettings {
  accent_color: string
  theme: 'light' | 'dark' | 'system'
  email_signature?: string
}

export interface PaymentMethodSettings {
  flutterwave_enabled: boolean
  paystack_enabled: boolean
  bank_transfer_enabled: boolean
  momo_enabled: boolean
  crypto_enabled: boolean
}

export interface BankDetail {
  id: string
  bank_name: string
  account_name: string
  account_number: string
  sort_code?: string
  swift_code?: string
  is_primary: boolean
}

export interface MobileMoneyDetail {
  id: string
  provider: string
  phone_number: string
  account_name: string
  is_primary: boolean
}

export interface CryptoWallet {
  id: string
  currency: string
  wallet_address: string
  network: string
  is_primary: boolean
}

export interface AddressInfo {
  line1?: string
  line2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
}

export interface Settings {
  // Profile info
  email: string
  full_name: string
  phone: string
  avatar_url: string
  
  // Account info
  account_type: string
  invoice_prefix: string
  email_verified: boolean
  setup_completed: boolean
  tax_id: string
  
  // Business info
  business_name: string
  business_type: string
  address: AddressInfo
  logo_url: string
  
  // Invoice defaults
  default_currency: string
  default_payment_terms: number
  
  // Payment details
  bank_details: BankDetail[]
  mobile_money_details: MobileMoneyDetail[]
  crypto_wallets: CryptoWallet[]
  
  // Extended settings
  notifications: NotificationSettings
  invoice_settings: InvoiceSettings
  branding: BrandingSettings
  payment_methods: PaymentMethodSettings
}

const defaultSettings: Settings = {
  email: '',
  full_name: '',
  phone: '',
  avatar_url: '',
  account_type: 'personal',
  invoice_prefix: 'GH',
  email_verified: false,
  setup_completed: false,
  tax_id: '',
  business_name: '',
  business_type: 'llc',
  address: {},
  logo_url: '',
  default_currency: 'GHS',
  default_payment_terms: 14,
  bank_details: [],
  mobile_money_details: [],
  crypto_wallets: [],
  notifications: {
    invoice_paid: true,
    payment_received: true,
    invoice_overdue: true,
    weekly_report: false,
    monthly_report: true,
    reminders_sent: true,
    new_customer: false,
  },
  invoice_settings: {
    on_time_threshold_days: 3,
    auto_reminders: true,
    default_tax_rate: 0,
    late_fee_enabled: false,
    late_fee_percent: 0,
  },
  branding: {
    accent_color: '#6366f1',
    theme: 'light',
  },
  payment_methods: {
    flutterwave_enabled: false,
    paystack_enabled: false,
    bank_transfer_enabled: true,
    momo_enabled: true,
    crypto_enabled: false,
  },
}

interface UseSettingsDataReturn {
  settings: Settings
  loading: boolean
  error: string | null
  updateSettings: (updates: Partial<Settings>) => Promise<void>
  refetch: () => Promise<void>
  saving: boolean
}

export function useSettingsData(): UseSettingsDataReturn {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/settings')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch settings')
      }

      setSettings(data.settings)
    } catch (err) {
      console.error('Error fetching settings:', err)
      setError(err instanceof Error ? err.message : 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSettings = useCallback(async (updates: Partial<Settings>) => {
    try {
      setSaving(true)
      setError(null)

      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings')
      }

      // Update local state with the returned settings
      setSettings(data.settings)
    } catch (err) {
      console.error('Error updating settings:', err)
      setError(err instanceof Error ? err.message : 'Failed to save settings')
      throw err // Re-throw so callers can handle it
    } finally {
      setSaving(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings,
    saving,
  }
}
