"use client"

import { useState, useEffect, useCallback } from 'react'
import type { PaymentMethod } from '@/types/database'

export interface PaymentWithAllocations {
  id: string
  amount: number
  currency: string
  payment_method: PaymentMethod | null
  reference: string | null
  payment_date: string
  payer_name: string | null
  payer_phone: string | null
  payer_email: string | null
  notes: string | null
  created_at: string
  allocations: {
    id: string
    amount: number
    invoice: {
      id: string
      invoice_number: string
      total: number
      customer: {
        id: string
        name: string
      } | null
    } | null
  }[]
}

export interface PaymentsFilters {
  method?: PaymentMethod
  from?: string
  to?: string
  page?: number
  limit?: number
}

interface UsePaymentsDataResult {
  payments: PaymentWithAllocations[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  refetch: () => Promise<void>
  setFilters: (filters: PaymentsFilters) => void
  filters: PaymentsFilters
}

export function usePaymentsData(initialFilters: PaymentsFilters = {}): UsePaymentsDataResult {
  const [payments, setPayments] = useState<PaymentWithAllocations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<PaymentsFilters>(initialFilters)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.method) params.append('method', filters.method)
      if (filters.from) params.append('from', filters.from)
      if (filters.to) params.append('to', filters.to)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())

      const response = await fetch(`/api/payments?${params.toString()}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view payments')
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch payments')
      }

      const result = await response.json()
      
      setPayments(result.payments || [])
      setPagination(result.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
    } catch (err) {
      console.error('Payments fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { 
    payments, 
    loading, 
    error, 
    pagination,
    refetch: fetchData, 
    setFilters,
    filters,
  }
}

// Single payment hook
interface UsePaymentDetailResult {
  payment: PaymentWithAllocations | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function usePaymentDetail(paymentId: string): UsePaymentDetailResult {
  const [payment, setPayment] = useState<PaymentWithAllocations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!paymentId) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/payments/${paymentId}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view this payment')
          return
        }
        if (response.status === 404) {
          setError('Payment not found')
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch payment')
      }

      const result = await response.json()
      setPayment(result.payment)
    } catch (err) {
      console.error('Payment fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load payment')
    } finally {
      setLoading(false)
    }
  }, [paymentId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { payment, loading, error, refetch: fetchData }
}

// Record payment against invoice
export interface RecordPaymentData {
  invoiceId: string
  amount: number
  payment_method: PaymentMethod
  reference?: string
  payment_date?: string
  payer_name?: string
  payer_phone?: string
  payer_email?: string
  notes?: string
}

export async function recordPayment(data: RecordPaymentData): Promise<{ success: boolean; payment?: PaymentWithAllocations; error?: string }> {
  try {
    const { invoiceId, ...paymentData } = data
    const response = await fetch(`/api/invoices/${invoiceId}/allocations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || 'Failed to record payment' }
    }
    
    const result = await response.json()
    return { success: true, payment: result.payment }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to record payment' }
  }
}

// Delete payment
export async function deletePayment(paymentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/payments/${paymentId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || 'Failed to delete payment' }
    }
    
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete payment' }
  }
}

// Helper to format payment method
export function formatPaymentMethod(method: PaymentMethod | null): string {
  if (!method) return 'Unknown'
  return method.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// Helper to get payment method icon color
export function getPaymentMethodColor(method: PaymentMethod | null): string {
  switch (method) {
    case 'mobile_money': return '#F59E0B'
    case 'bank_transfer': return '#3B82F6'
    case 'card': return '#8B5CF6'
    case 'crypto': return '#EC4899'
    case 'cash': return '#10B981'
    default: return '#6B7280'
  }
}
