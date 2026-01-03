"use client"

import { useState, useEffect, useCallback } from 'react'

export interface ProductService {
  id: string
  user_id: string
  name: string
  description: string | null
  details: string | null
  type: 'product' | 'service'
  unit_price: number
  currency: string
  default_tax: number
  default_discount: number
  discount_type: 'percent' | 'fixed'
  sku: string | null
  is_active: boolean
  category: string | null
  created_at: string
  updated_at: string
}

export interface ProductServiceInput {
  name: string
  description?: string
  details?: string
  type: 'product' | 'service'
  unit_price: number
  currency?: string
  default_tax?: number
  default_discount?: number
  discount_type?: 'percent' | 'fixed'
  sku?: string
  is_active?: boolean
  category?: string
}

export interface ProductsFilters {
  search?: string
  type?: 'product' | 'service' | 'all'
  category?: string
  is_active?: boolean
  page?: number
  limit?: number
}

interface UseProductsServicesResult {
  products: ProductService[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  refetch: () => Promise<void>
  setFilters: (filters: ProductsFilters) => void
  filters: ProductsFilters
  createProduct: (data: ProductServiceInput) => Promise<ProductService>
  updateProduct: (id: string, data: Partial<ProductServiceInput>) => Promise<ProductService>
  deleteProduct: (id: string) => Promise<void>
}

export function useProductsServices(initialFilters: ProductsFilters = {}): UseProductsServicesResult {
  const [products, setProducts] = useState<ProductService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductsFilters>(initialFilters)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.search) params.append('q', filters.search)
      if (filters.type && filters.type !== 'all') params.append('type', filters.type)
      if (filters.category) params.append('category', filters.category)
      if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString())
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())

      const response = await fetch(`/api/products?${params.toString()}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view products')
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch products')
      }

      const result = await response.json()
      
      setProducts(result.products || [])
      setPagination(result.pagination || {
        page: 1,
        limit: 50,
        total: result.products?.length || 0,
        totalPages: 1,
      })
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const createProduct = async (data: ProductServiceInput): Promise<ProductService> => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create product')
    }

    const result = await response.json()
    
    // Add to local state
    setProducts(prev => [result.product, ...prev])
    
    return result.product
  }

  const updateProduct = async (id: string, data: Partial<ProductServiceInput>): Promise<ProductService> => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to update product')
    }

    const result = await response.json()
    
    // Update in local state
    setProducts(prev => prev.map(p => p.id === id ? result.product : p))
    
    return result.product
  }

  const deleteProduct = async (id: string): Promise<void> => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete product')
    }

    // Remove from local state
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return {
    products,
    loading,
    error,
    pagination,
    refetch: fetchData,
    setFilters,
    filters,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
