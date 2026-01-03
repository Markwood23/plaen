"use client"

import { useState, useEffect, useCallback } from 'react'
import type { InvoiceStatus } from '@/types/database'

export interface InvoiceWithCustomer {
  id: string
  public_id?: string | null
  invoice_number: string
  customer_id: string | null
  customer: {
    id: string
    name: string
    email: string | null
    company: string | null
  } | null
  total: number
  balance_due: number
  status: InvoiceStatus | null
  issue_date: string
  due_date: string | null
  currency: string
  notes: string | null
  created_at: string
}

export interface InvoicesFilters {
  status?: string
  customerId?: string
  from?: string
  to?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface UseInvoicesDataResult {
  invoices: InvoiceWithCustomer[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  refetch: () => Promise<void>
  setFilters: (filters: InvoicesFilters) => void
  filters: InvoicesFilters
}

export function useInvoicesData(initialFilters: InvoicesFilters = {}): UseInvoicesDataResult {
  const [invoices, setInvoices] = useState<InvoiceWithCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<InvoicesFilters>(initialFilters)
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
      if (filters.status && filters.status !== 'all') params.append('status', filters.status)
      if (filters.customerId) params.append('customer_id', filters.customerId)
      if (filters.from) params.append('from', filters.from)
      if (filters.to) params.append('to', filters.to)
      if (filters.search) params.append('q', filters.search)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.sortBy) params.append('sort_by', filters.sortBy)
      if (filters.sortOrder) params.append('sort_order', filters.sortOrder)

      const response = await fetch(`/api/invoices?${params.toString()}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view invoices')
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch invoices')
      }

      const result = await response.json()
      
      setInvoices(result.invoices || [])
      setPagination(result.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
    } catch (err) {
      console.error('Invoices fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { 
    invoices, 
    loading, 
    error, 
    pagination,
    refetch: fetchData, 
    setFilters,
    filters,
  }
}

// Single invoice hook
export interface InvoiceDetail extends InvoiceWithCustomer {
  line_items: {
    id: string
    description: string
    quantity: number
    unit_price: number
    total: number
  }[]
  allocations: {
    id: string
    amount: number
    payment: {
      id: string
      payment_method: string
      payment_date: string
      reference: string | null
    }
  }[]

  attachments?: {
    id: string
    entity_id: string
    entity_type: string
    file_name: string
    file_url: string
    mime_type: string | null
    file_size: number | null
    created_at: string
    download_url?: string | null
  }[]
}

interface UseInvoiceDetailResult {
  invoice: InvoiceDetail | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useInvoiceDetail(invoiceId: string): UseInvoiceDetailResult {
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!invoiceId) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/invoices/${invoiceId}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view this invoice')
          return
        }
        if (response.status === 404) {
          setError('Invoice not found')
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch invoice')
      }

      const result = await response.json()
      setInvoice(result.invoice)
    } catch (err) {
      console.error('Invoice fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load invoice')
    } finally {
      setLoading(false)
    }
  }, [invoiceId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { invoice, loading, error, refetch: fetchData }
}

// Delete invoice
export async function deleteInvoice(invoiceId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/invoices/${invoiceId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || 'Failed to delete invoice' }
    }
    
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete invoice' }
  }
}

// Create invoice
export interface CreateInvoiceData {
  customer_id?: string
  issue_date: string
  due_date?: string
  currency?: string
  notes?: string
  tax_amount?: number
  discount_amount?: number
  line_items: {
    description: string
    quantity: number
    unit_price: number
  }[]
}

export async function createInvoice(data: CreateInvoiceData): Promise<{ success: boolean; invoice?: InvoiceDetail; error?: string }> {
  try {
    const { line_items, ...rest } = data
    // API expects `items`; keep `line_items` as the client-facing shape.
    const payload = { ...rest, items: line_items }

    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || 'Failed to create invoice' }
    }
    
    const result = await response.json()
    return { success: true, invoice: result.invoice }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create invoice' }
  }
}

// Update invoice
export async function updateInvoice(invoiceId: string, data: Partial<CreateInvoiceData>): Promise<{ success: boolean; invoice?: InvoiceDetail; error?: string }> {
  try {
    const payload = (() => {
      if (!('line_items' in data)) return data
      const { line_items, ...rest } = data as CreateInvoiceData
      return { ...rest, items: line_items }
    })()

    const response = await fetch(`/api/invoices/${invoiceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || 'Failed to update invoice' }
    }
    
    const result = await response.json()
    return { success: true, invoice: result.invoice }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update invoice' }
  }
}

// Bulk delete invoices
export async function bulkDeleteInvoices(invoiceIds: string[]): Promise<{ success: boolean; deleted: number; error?: string }> {
  try {
    const response = await fetch('/api/invoices/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoice_ids: invoiceIds }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, deleted: 0, error: errorData.error || 'Failed to delete invoices' }
    }
    
    const result = await response.json()
    return { success: true, deleted: result.deleted }
  } catch (err) {
    return { success: false, deleted: 0, error: err instanceof Error ? err.message : 'Failed to delete invoices' }
  }
}

// Bulk mark invoices as sent
export async function bulkMarkAsSent(invoiceIds: string[]): Promise<{ success: boolean; updated: number; error?: string }> {
  try {
    const response = await fetch('/api/invoices/bulk-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoice_ids: invoiceIds }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, updated: 0, error: errorData.error || 'Failed to update invoices' }
    }
    
    const result = await response.json()
    return { success: true, updated: result.updated }
  } catch (err) {
    return { success: false, updated: 0, error: err instanceof Error ? err.message : 'Failed to update invoices' }
  }
}

// Export invoices to CSV
export function exportInvoicesToCSV(invoices: InvoiceWithCustomer[]): void {
  const formatCurrency = (amount: number) => (amount / 100).toFixed(2)
  
  const headers = [
    'Invoice Number',
    'Customer',
    'Company',
    'Email',
    'Issue Date',
    'Due Date',
    'Status',
    'Currency',
    'Total',
    'Balance Due',
    'Notes',
  ]
  
  const rows = invoices.map(invoice => [
    invoice.invoice_number,
    invoice.customer?.name || '',
    invoice.customer?.company || '',
    invoice.customer?.email || '',
    invoice.issue_date,
    invoice.due_date || '',
    invoice.status || '',
    invoice.currency,
    formatCurrency(invoice.total),
    formatCurrency(invoice.balance_due),
    (invoice.notes || '').replace(/"/g, '""'), // Escape quotes
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `invoices-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
