"use client"

import { useState, useEffect, useCallback } from 'react'

export interface Contact {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  address: string | null
  city: string | null
  country: string | null
  notes: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
  // Computed from invoices
  totalInvoices?: number
  totalPaid?: number
  totalOutstanding?: number
  status?: 'Active' | 'Inactive'
}

export interface ContactsFilters {
  search?: string
  category?: string
  page?: number
  limit?: number
}

interface UseContactsDataResult {
  contacts: Contact[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  refetch: () => Promise<void>
  setFilters: (filters: ContactsFilters) => void
  filters: ContactsFilters
}

export function useContactsData(initialFilters: ContactsFilters = {}): UseContactsDataResult {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ContactsFilters>(initialFilters)
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
      if (filters.search) params.append('q', filters.search)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())

      const response = await fetch(`/api/contacts?${params.toString()}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view contacts')
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch contacts')
      }

      const result = await response.json()
      
      setContacts(result.contacts || [])
      setPagination(result.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
    } catch (err) {
      console.error('Contacts fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { 
    contacts, 
    loading, 
    error, 
    pagination,
    refetch: fetchData, 
    setFilters,
    filters,
  }
}

// Single contact with stats
export interface ContactDetail extends Contact {
  invoiceStats?: {
    total_invoices: number
    total_paid: number
    total_outstanding: number
    paid_count: number
    pending_count: number
    overdue_count: number
  }
}

interface UseContactDetailResult {
  contact: ContactDetail | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useContactDetail(contactId: string): UseContactDetailResult {
  const [contact, setContact] = useState<ContactDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!contactId) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/contacts/${contactId}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view this contact')
          return
        }
        if (response.status === 404) {
          setError('Contact not found')
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch contact')
      }

      const result = await response.json()
      setContact(result.contact)
    } catch (err) {
      console.error('Contact fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load contact')
    } finally {
      setLoading(false)
    }
  }, [contactId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { contact, loading, error, refetch: fetchData }
}

// Create contact
export interface CreateContactData {
  name: string
  email?: string
  phone?: string
  company?: string
  address?: string
  city?: string
  country?: string
  notes?: string
  tags?: string[]
}

export async function createContact(data: CreateContactData): Promise<{ success: boolean; contact?: Contact; error?: string }> {
  try {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || 'Failed to create contact' }
    }
    
    const result = await response.json()
    return { success: true, contact: result.contact }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create contact' }
  }
}

// Update contact
export async function updateContact(contactId: string, data: Partial<CreateContactData>): Promise<{ success: boolean; contact?: Contact; error?: string }> {
  try {
    const response = await fetch(`/api/contacts/${contactId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || 'Failed to update contact' }
    }
    
    const result = await response.json()
    return { success: true, contact: result.contact }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update contact' }
  }
}

// Delete contact
export async function deleteContact(contactId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/contacts/${contactId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || 'Failed to delete contact' }
    }
    
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete contact' }
  }
}
