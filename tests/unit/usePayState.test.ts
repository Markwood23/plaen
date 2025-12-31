import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { usePayState, PaymentMethod, PaymentState } from '@/hooks/usePayState'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true,
  configurable: true,
})

describe('usePayState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'pending' }),
    })
  })

  describe('initial state', () => {
    it('initializes with correct defaults', () => {
      const { result } = renderHook(() => 
        usePayState('inv-123', 10000)
      )

      expect(result.current.state.status).toBe('idle')
      expect(result.current.state.method).toBeNull()
      expect(result.current.state.amount).toBe(10000)
      expect(result.current.state.error).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.canPay).toBe(false)
    })
  })

  describe('selectMethod', () => {
    it('updates method and status', () => {
      const { result } = renderHook(() => 
        usePayState('inv-123', 10000)
      )

      act(() => {
        result.current.selectMethod('momo')
      })

      expect(result.current.state.method).toBe('momo')
      expect(result.current.state.status).toBe('selecting')
    })

    it('enables canPay when method selected with valid amount', () => {
      const { result } = renderHook(() => 
        usePayState('inv-123', 10000)
      )

      act(() => {
        result.current.selectMethod('momo')
      })

      expect(result.current.canPay).toBe(true)
    })
  })

  describe('setAmount', () => {
    it('updates amount in state', () => {
      const { result } = renderHook(() => 
        usePayState('inv-123', 10000)
      )

      act(() => {
        result.current.setAmount(25000)
      })

      expect(result.current.state.amount).toBe(25000)
    })

    it('clears any previous error', () => {
      const { result } = renderHook(() => 
        usePayState('inv-123', 10000)
      )

      // First set error state by trying to pay without method
      act(() => {
        result.current.initiatePayment()
      })

      expect(result.current.state.error).toBeTruthy()

      // Then update amount
      act(() => {
        result.current.setAmount(25000)
      })

      expect(result.current.state.error).toBeNull()
    })
  })

  describe('initiatePayment', () => {
    it('requires method to be selected', async () => {
      const { result } = renderHook(() => 
        usePayState('inv-123', 10000)
      )

      await act(async () => {
        await result.current.initiatePayment()
      })

      expect(result.current.state.error).toContain('select a payment method')
      expect(mockFetch).not.toHaveBeenCalledWith(
        expect.stringContaining('/api/payments/initiate'),
        expect.any(Object)
      )
    })

    it('requires positive amount', async () => {
      const { result } = renderHook(() => 
        usePayState('inv-123', 0)
      )

      act(() => {
        result.current.selectMethod('momo')
      })

      await act(async () => {
        await result.current.initiatePayment()
      })

      expect(result.current.state.error).toBeTruthy()
    })

    it('calls payment API with correct params', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'pending' }),
      }).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ transaction_id: 'txn-123' }),
      })

      const { result } = renderHook(() => 
        usePayState('inv-123', 10000)
      )

      act(() => {
        result.current.selectMethod('momo')
      })

      await act(async () => {
        await result.current.initiatePayment()
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoice_id: 'inv-123',
          method: 'momo',
          amount: 10000,
        }),
      })
    })
  })

  describe('resetPayment', () => {
    it('resets state to idle', () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'pending' }),
      })

      const { result } = renderHook(() => 
        usePayState('inv-123', 10000)
      )

      // Make some changes
      act(() => {
        result.current.selectMethod('bank')
        result.current.setAmount(50000)
      })

      // Reset
      act(() => {
        result.current.resetPayment()
      })

      expect(result.current.state.status).toBe('idle')
      expect(result.current.state.method).toBeNull()
      expect(result.current.state.error).toBeNull()
    })
  })

  describe('offline handling', () => {
    it('handles offline state', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false })
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'pending' }),
      })

      const { result } = renderHook(() => 
        usePayState('inv-123', 10000)
      )

      act(() => {
        result.current.selectMethod('momo')
      })

      await act(async () => {
        await result.current.initiatePayment()
      })

      expect(result.current.state.status).toBe('offline')
      expect(result.current.state.error).toContain('internet')
      
      // Reset for other tests
      Object.defineProperty(navigator, 'onLine', { value: true })
    })
  })
})
