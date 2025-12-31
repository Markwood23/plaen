"use client"

import { useState, useEffect, useRef, useCallback } from 'react'

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface UseAutoSaveOptions<T> {
  data: T
  onSave: (data: T) => Promise<{ success: boolean; error?: string }>
  debounceMs?: number
  enabled?: boolean
}

interface UseAutoSaveResult {
  status: AutoSaveStatus
  lastSavedAt: Date | null
  error: string | null
  forceSave: () => Promise<void>
}

export function useAutoSave<T>({
  data,
  onSave,
  debounceMs = 2000,
  enabled = true,
}: UseAutoSaveOptions<T>): UseAutoSaveResult {
  const [status, setStatus] = useState<AutoSaveStatus>('idle')
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Track the latest data and whether it's dirty (changed since last save)
  const dataRef = useRef<T>(data)
  const savedDataRef = useRef<string | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)
  
  // Serialize data for comparison
  const serialize = useCallback((d: T) => JSON.stringify(d), [])
  
  // Check if data has changed since last save
  const isDirty = useCallback(() => {
    const currentSerialized = serialize(data)
    return currentSerialized !== savedDataRef.current
  }, [data, serialize])
  
  // Perform the actual save
  const performSave = useCallback(async () => {
    if (!enabled || !isDirty()) {
      return
    }
    
    setStatus('saving')
    setError(null)
    
    try {
      const currentData = dataRef.current
      const result = await onSave(currentData)
      
      if (!isMountedRef.current) return
      
      if (result.success) {
        savedDataRef.current = serialize(currentData)
        setStatus('saved')
        setLastSavedAt(new Date())
        
        // Reset to idle after a moment
        setTimeout(() => {
          if (isMountedRef.current) {
            setStatus('idle')
          }
        }, 2000)
      } else {
        setStatus('error')
        setError(result.error || 'Save failed')
      }
    } catch (err) {
      if (!isMountedRef.current) return
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }, [enabled, isDirty, onSave, serialize])
  
  // Force save immediately
  const forceSave = useCallback(async () => {
    // Clear any pending debounced save
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
      debounceTimeoutRef.current = null
    }
    await performSave()
  }, [performSave])
  
  // Update data ref and trigger debounced save when data changes
  useEffect(() => {
    dataRef.current = data
    
    if (!enabled) return
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    
    // Set new debounced save
    debounceTimeoutRef.current = setTimeout(() => {
      performSave()
    }, debounceMs)
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [data, debounceMs, enabled, performSave])
  
  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])
  
  // Save on page unload if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty()) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])
  
  return {
    status,
    lastSavedAt,
    error,
    forceSave,
  }
}

// Helper component to display auto-save status
export function AutoSaveIndicator({
  status,
  lastSavedAt,
  error,
}: {
  status: AutoSaveStatus
  lastSavedAt: Date | null
  error: string | null
}) {
  if (status === 'saving') {
    return (
      <span className="text-xs text-gray-400 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
        Saving...
      </span>
    )
  }
  
  if (status === 'saved') {
    return (
      <span className="text-xs text-green-600 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        Saved
      </span>
    )
  }
  
  if (status === 'error') {
    return (
      <span className="text-xs text-red-500 flex items-center gap-1" title={error || 'Save failed'}>
        <span className="w-2 h-2 rounded-full bg-red-500" />
        Save failed
      </span>
    )
  }
  
  // Idle state - show last saved time if available
  if (lastSavedAt) {
    const timeAgo = getTimeAgo(lastSavedAt)
    return (
      <span className="text-xs text-gray-400">
        Last saved {timeAgo}
      </span>
    )
  }
  
  return <span className="text-xs text-gray-400">Not saved yet</span>
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return date.toLocaleDateString()
}
