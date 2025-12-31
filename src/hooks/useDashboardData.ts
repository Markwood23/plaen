"use client"

import { useState, useEffect, useCallback } from 'react'

interface DashboardMetrics {
  total_revenue: number
  total_outstanding: number
  total_invoices: number
  paid_invoices: number
  pending_invoices: number
  overdue_invoices: number
  revenue_change_percent: number | null
  outstanding_change_percent: number | null
}

interface ARAging {
  current: { count: number; total: number }
  attention: { count: number; total: number }
  concerning: { count: number; total: number }
  critical: { count: number; total: number }
}

interface ChartDataPoint {
  month: string
  year: number
  revenue: number
  invoiced: number
}

interface RecentInvoice {
  id: string
  invoice_number: string
  customer: { id: string; name: string; email: string | null }
  total: number
  balance_due: number
  status: string
  issue_date: string
  due_date: string | null
  currency: string
}

interface RecentPayment {
  id: string
  amount: number
  payment_method: string
  payment_date: string
  reference: string | null
  payer_name: string | null
  currency: string
  allocations: {
    invoice: { 
      id: string
      invoice_number: string
      customer: { name: string } 
    }
  }[]
}

export interface DashboardData {
  metrics: DashboardMetrics
  arAging: ARAging
  chartData: ChartDataPoint[]
  recentInvoices: RecentInvoice[]
  recentPayments: RecentPayment[]
}

interface UseDashboardDataResult {
  data: DashboardData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const defaultMetrics: DashboardMetrics = {
  total_revenue: 0,
  total_outstanding: 0,
  total_invoices: 0,
  paid_invoices: 0,
  pending_invoices: 0,
  overdue_invoices: 0,
  revenue_change_percent: 0,
  outstanding_change_percent: 0,
}

const defaultARAging: ARAging = {
  current: { count: 0, total: 0 },
  attention: { count: 0, total: 0 },
  concerning: { count: 0, total: 0 },
  critical: { count: 0, total: 0 },
}

export function useDashboardData(): UseDashboardDataResult {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/dashboard')
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view your dashboard')
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch dashboard data')
      }

      const result = await response.json()
      
      setData({
        metrics: { ...defaultMetrics, ...(result.metrics ?? {}) },
        arAging: result.ar_aging || defaultARAging,
        chartData: result.chart_data || [],
        recentInvoices: result.recent_invoices || [],
        recentPayments: result.recent_payments || [],
      })
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Helper function to format currency
export function formatCurrency(amount: number, currency: string = 'GHS'): string {
  const symbols: Record<string, string> = {
    GHS: '₵',
    USD: '$',
    EUR: '€',
    GBP: '£',
    NGN: '₦',
    KES: 'KSh',
    ZAR: 'R',
  }
  
  const symbol = symbols[currency] || currency + ' '
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Helper function to format compact currency (e.g., ₵31.1k)
export function formatCompactCurrency(amount: number, currency: string = 'GHS'): string {
  const symbols: Record<string, string> = {
    GHS: '₵',
    USD: '$',
    EUR: '€',
    GBP: '£',
    NGN: '₦',
    KES: 'KSh',
    ZAR: 'R',
  }
  
  const symbol = symbols[currency] || currency + ' '
  
  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}m`
  }
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}k`
  }
  return `${symbol}${amount.toFixed(0)}`
}

// Helper to get status badge styling
export function getStatusBadgeStyles(status: string): { bg: string; text: string } {
  switch (status?.toLowerCase()) {
    case 'paid':
      return { bg: 'rgba(20, 70, 42, 0.1)', text: '#14462a' }
    case 'sent':
    case 'viewed':
      return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' }
    case 'partially_paid':
      return { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' }
    case 'overdue':
      return { bg: 'rgba(220, 38, 38, 0.1)', text: '#DC2626' }
    case 'cancelled':
      return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6B7280' }
    case 'draft':
    default:
      return { bg: 'rgba(107, 114, 128, 0.08)', text: '#6B7280' }
  }
}
