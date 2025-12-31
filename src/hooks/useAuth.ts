"use client"

import { AuthProvider, useAuth } from '@/contexts/auth-context'

export { useAuth, AuthProvider }

// Additional auth utilities

/**
 * Check if user is authenticated (for conditional rendering)
 */
export function useIsAuthenticated() {
  const { user, loading } = useAuth()
  return { isAuthenticated: !!user, loading }
}

/**
 * Get user's display name (business name or full name)
 */
export function useDisplayName() {
  const { profile } = useAuth()
  return profile?.business_name || profile?.full_name || 'User'
}
