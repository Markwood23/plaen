import { describe, it, expect } from 'vitest'
import {
  getAgingBucket,
  isOverdue,
  isDueSoon,
  calculateDSO,
  calculateOnTimeRate,
  calculateCollectionRate,
  getDaysUntilDue,
  formatDaysUntilDue,
} from '@/lib/utils/dates'

describe('Date Utilities', () => {
  describe('getAgingBucket', () => {
    it('returns current for 0-30 days', () => {
      const today = new Date('2025-01-15')
      const dueDate = new Date('2025-01-10') // 5 days overdue
      
      const result = getAgingBucket(dueDate, today)
      expect(result.bucket).toBe('current')
      expect(result.daysOverdue).toBe(5)
    })

    it('returns attention for 31-60 days', () => {
      const today = new Date('2025-02-20')
      const dueDate = new Date('2025-01-10') // 41 days overdue
      
      const result = getAgingBucket(dueDate, today)
      expect(result.bucket).toBe('attention')
    })

    it('returns concerning for 61-90 days', () => {
      const today = new Date('2025-03-20')
      const dueDate = new Date('2025-01-10') // 69 days overdue
      
      const result = getAgingBucket(dueDate, today)
      expect(result.bucket).toBe('concerning')
    })

    it('returns critical for 90+ days', () => {
      const today = new Date('2025-04-20')
      const dueDate = new Date('2025-01-10') // 100 days overdue
      
      const result = getAgingBucket(dueDate, today)
      expect(result.bucket).toBe('critical')
    })

    it('handles string date input', () => {
      const result = getAgingBucket('2025-01-10', new Date('2025-01-15'))
      expect(result.bucket).toBe('current')
      expect(result.daysOverdue).toBe(5)
    })
  })

  describe('isOverdue', () => {
    it('returns true when past due with balance', () => {
      const dueDate = new Date(Date.now() - 86400000) // Yesterday
      expect(isOverdue(dueDate, 10000)).toBe(true)
    })

    it('returns false when past due but no balance', () => {
      const dueDate = new Date(Date.now() - 86400000) // Yesterday
      expect(isOverdue(dueDate, 0)).toBe(false)
    })

    it('returns false when not yet due', () => {
      const dueDate = new Date(Date.now() + 86400000) // Tomorrow
      expect(isOverdue(dueDate, 10000)).toBe(false)
    })

    it('handles string date input', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      expect(isOverdue(yesterday, 10000)).toBe(true)
    })
  })

  describe('isDueSoon', () => {
    it('returns true for invoices due within threshold', () => {
      const dueDate = new Date(Date.now() + 3 * 86400000) // 3 days from now
      expect(isDueSoon(dueDate, 7)).toBe(true)
    })

    it('returns false for invoices due beyond threshold', () => {
      const dueDate = new Date(Date.now() + 10 * 86400000) // 10 days from now
      expect(isDueSoon(dueDate, 7)).toBe(false)
    })

    it('returns false for overdue invoices', () => {
      const dueDate = new Date(Date.now() - 86400000) // Yesterday
      expect(isDueSoon(dueDate, 7)).toBe(false)
    })
  })

  describe('calculateDSO', () => {
    it('calculates DSO correctly', () => {
      // $10,000 outstanding, $30,000 sales over 30 days
      // DSO = (10000 / 30000) * 30 = 10 days
      expect(calculateDSO(1000000, 3000000, 30)).toBe(10)
    })

    it('returns 0 when no sales', () => {
      expect(calculateDSO(100000, 0, 30)).toBe(0)
    })

    it('rounds to 1 decimal place', () => {
      // DSO = (10000 / 33333) * 30 = 9.0001...
      expect(calculateDSO(1000000, 3333300, 30)).toBe(9)
    })
  })

  describe('calculateOnTimeRate', () => {
    it('calculates on-time rate correctly', () => {
      const invoices = [
        { issueDate: '2025-01-01', paidDate: '2025-01-02', status: 'paid' }, // 1 day - on time
        { issueDate: '2025-01-01', paidDate: '2025-01-03', status: 'paid' }, // 2 days - on time
        { issueDate: '2025-01-01', paidDate: '2025-01-10', status: 'paid' }, // 9 days - late
        { issueDate: '2025-01-01', paidDate: '2025-01-04', status: 'paid' }, // 3 days - on time
      ]
      
      // 3 out of 4 paid within 3 days = 75%
      expect(calculateOnTimeRate(invoices, 3)).toBe(75)
    })

    it('returns 0 when no paid invoices', () => {
      const invoices = [
        { issueDate: '2025-01-01', paidDate: null, status: 'sent' },
      ]
      expect(calculateOnTimeRate(invoices, 3)).toBe(0)
    })

    it('ignores unpaid invoices', () => {
      const invoices = [
        { issueDate: '2025-01-01', paidDate: '2025-01-02', status: 'paid' },
        { issueDate: '2025-01-01', paidDate: null, status: 'sent' },
        { issueDate: '2025-01-01', paidDate: null, status: 'overdue' },
      ]
      
      // 1 out of 1 paid on time = 100%
      expect(calculateOnTimeRate(invoices, 3)).toBe(100)
    })
  })

  describe('calculateCollectionRate', () => {
    it('calculates collection rate correctly', () => {
      // $7,500 collected out of $10,000 invoiced = 75%
      expect(calculateCollectionRate(750000, 1000000)).toBe(75)
    })

    it('returns 0 when nothing invoiced', () => {
      expect(calculateCollectionRate(0, 0)).toBe(0)
    })

    it('returns 100 when fully collected', () => {
      expect(calculateCollectionRate(1000000, 1000000)).toBe(100)
    })
  })

  describe('getDaysUntilDue', () => {
    it('returns positive for future due dates', () => {
      const dueDate = new Date(Date.now() + 5 * 86400000)
      const days = getDaysUntilDue(dueDate)
      expect(days).toBeGreaterThan(0)
    })

    it('returns negative for past due dates', () => {
      const dueDate = new Date(Date.now() - 5 * 86400000)
      const days = getDaysUntilDue(dueDate)
      expect(days).toBeLessThan(0)
    })
  })

  describe('formatDaysUntilDue', () => {
    it('formats due today', () => {
      const today = new Date()
      today.setHours(12, 0, 0, 0) // Midday today
      expect(formatDaysUntilDue(today)).toBe('Due today')
    })

    it('formats future due dates', () => {
      const future = new Date(Date.now() + 5 * 86400000)
      expect(formatDaysUntilDue(future)).toContain('Due in')
    })

    it('formats overdue dates', () => {
      const past = new Date(Date.now() - 5 * 86400000)
      expect(formatDaysUntilDue(past)).toContain('overdue')
    })
  })
})
