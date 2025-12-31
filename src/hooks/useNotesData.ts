"use client"

import { useState, useEffect, useCallback } from 'react'

export interface Note {
  id: string
  title: string
  content: string | null
  preview: string | null
  category: string | null
  tags: string[] | null
  is_pinned: boolean
  attachment_count: number
  word_count: number
  created_at: string
  updated_at: string
}

export interface NotesFilters {
  search?: string
  category?: string
  pinned?: boolean
  page?: number
  limit?: number
}

interface UseNotesDataResult {
  notes: Note[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  refetch: () => Promise<void>
  setFilters: (filters: NotesFilters) => void
  filters: NotesFilters
}

export function useNotesData(initialFilters: NotesFilters = {}): UseNotesDataResult {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<NotesFilters>(initialFilters)
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
      if (filters.category) params.append('category', filters.category)
      if (filters.pinned) params.append('pinned', 'true')
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())

      const response = await fetch(`/api/notes?${params.toString()}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view notes')
          return
        }
        if (response.status === 404) {
          // API not implemented yet - show empty state
          setNotes([])
          setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 })
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch notes')
      }

      const result = await response.json()
      
      setNotes(result.notes || [])
      setPagination(result.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
    } catch (err) {
      console.error('Notes fetch error:', err)
      // If API doesn't exist yet, just show empty state
      setNotes([])
      setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 })
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { 
    notes, 
    loading, 
    error, 
    pagination,
    refetch: fetchData, 
    setFilters,
    filters,
  }
}

// Single note hook
interface UseNoteDetailResult {
  note: Note | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useNoteDetail(noteId: string): UseNoteDetailResult {
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!noteId) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/notes/${noteId}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view this note')
          return
        }
        if (response.status === 404) {
          setError('Note not found')
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch note')
      }

      const result = await response.json()
      setNote(result.note || null)
    } catch (err) {
      console.error('Note detail fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load note')
    } finally {
      setLoading(false)
    }
  }, [noteId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { note, loading, error, refetch: fetchData }
}

// CRUD operations
export async function createNote(data: {
  title: string
  content?: string
  category?: string
  tags?: string[]
}): Promise<{ success: boolean; note?: Note; error?: string }> {
  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || 'Failed to create note' }
    }
    
    const result = await response.json()
    return { success: true, note: result.note }
  } catch (err) {
    return { success: false, error: 'Failed to create note' }
  }
}

export async function updateNote(
  noteId: string,
  data: Partial<{
    title: string
    content: string
    category: string
    tags: string[]
    is_pinned: boolean
  }>
): Promise<{ success: boolean; note?: Note; error?: string }> {
  try {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || 'Failed to update note' }
    }
    
    const result = await response.json()
    return { success: true, note: result.note }
  } catch (err) {
    return { success: false, error: 'Failed to update note' }
  }
}

export async function deleteNote(noteId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || 'Failed to delete note' }
    }
    
    return { success: true }
  } catch (err) {
    return { success: false, error: 'Failed to delete note' }
  }
}
