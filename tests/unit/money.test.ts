import { describe, it, expect } from 'vitest'
import {
  toMinorUnits,
  toMajorUnits,
  formatCurrency,
  parseAmount,
  calculateLineItemTotal,
  calculateInvoiceTotals,
  calculateBalanceDue,
  validateAmount,
} from '@/lib/utils/money'

describe('Money Utilities', () => {
  describe('toMinorUnits', () => {
    it('converts major units to minor units', () => {
      expect(toMinorUnits(12.50)).toBe(1250)
      expect(toMinorUnits(100)).toBe(10000)
      expect(toMinorUnits(0.01)).toBe(1)
      expect(toMinorUnits(0)).toBe(0)
    })

    it('handles floating point precision', () => {
      // 0.1 + 0.2 = 0.30000000000000004 in JS
      expect(toMinorUnits(0.1 + 0.2)).toBe(30)
    })

    it('rounds correctly', () => {
      expect(toMinorUnits(12.999)).toBe(1300)
      expect(toMinorUnits(12.001)).toBe(1200)
      expect(toMinorUnits(12.005)).toBe(1201) // Rounds up at .5
    })
  })

  describe('toMajorUnits', () => {
    it('converts minor units to major units', () => {
      expect(toMajorUnits(1250)).toBe(12.50)
      expect(toMajorUnits(10000)).toBe(100)
      expect(toMajorUnits(1)).toBe(0.01)
      expect(toMajorUnits(0)).toBe(0)
    })
  })

  describe('formatCurrency', () => {
    it('formats GHS correctly', () => {
      expect(formatCurrency(125000)).toBe('₵1,250.00')
      expect(formatCurrency(50)).toBe('₵0.50')
      expect(formatCurrency(0)).toBe('₵0.00')
    })

    it('formats USD correctly', () => {
      expect(formatCurrency(125000, 'USD')).toBe('$1,250.00')
    })

    it('respects showSymbol option', () => {
      expect(formatCurrency(125000, 'GHS', { showSymbol: false })).toBe('1,250.00')
    })
  })

  describe('parseAmount', () => {
    it('parses plain numbers', () => {
      expect(parseAmount('12.50')).toBe(1250)
      expect(parseAmount('100')).toBe(10000)
      expect(parseAmount('0.01')).toBe(1)
    })

    it('handles currency symbols', () => {
      expect(parseAmount('₵12.50')).toBe(1250)
      expect(parseAmount('$100.00')).toBe(10000)
      expect(parseAmount('€50.25')).toBe(5025)
    })

    it('handles commas and whitespace', () => {
      expect(parseAmount('1,250.00')).toBe(125000)
      expect(parseAmount('  12.50  ')).toBe(1250)
      expect(parseAmount('₵ 1,000.00')).toBe(100000)
    })

    it('returns null for invalid input', () => {
      expect(parseAmount('')).toBeNull()
      expect(parseAmount('abc')).toBeNull()
      expect(parseAmount('12.50.00')).toBeNull()
    })
  })

  describe('calculateLineItemTotal', () => {
    it('calculates simple line item', () => {
      const result = calculateLineItemTotal(2, 5000) // 2 × ₵50
      expect(result.subtotal).toBe(10000)
      expect(result.tax).toBe(0)
      expect(result.total).toBe(10000)
    })

    it('applies item-level tax', () => {
      // 10% tax = 1000 basis points
      const result = calculateLineItemTotal(1, 10000, 1000)
      expect(result.subtotal).toBe(10000)
      expect(result.tax).toBe(1000) // 10% of 10000
      expect(result.total).toBe(11000)
    })

    it('applies item-level discount before tax', () => {
      // ₵100 item, ₵10 discount, 10% tax
      const result = calculateLineItemTotal(1, 10000, 1000, 1000)
      expect(result.subtotal).toBe(10000)
      expect(result.tax).toBe(900) // 10% of (10000 - 1000)
      expect(result.total).toBe(9900) // 9000 + 900
    })

    it('handles fractional quantities', () => {
      const result = calculateLineItemTotal(1.5, 10000)
      expect(result.subtotal).toBe(15000)
    })
  })

  describe('calculateInvoiceTotals', () => {
    it('calculates totals for multiple items', () => {
      const items = [
        { quantity: 2, unitPriceMinor: 5000 },  // ₵100
        { quantity: 1, unitPriceMinor: 3000 },  // ₵30
      ]
      const result = calculateInvoiceTotals(items)
      expect(result.subtotal).toBe(13000)
      expect(result.total).toBe(13000)
    })

    it('applies invoice-level discount', () => {
      const items = [{ quantity: 1, unitPriceMinor: 10000 }]
      const result = calculateInvoiceTotals(items, 2000) // ₵20 discount
      expect(result.invoiceDiscount).toBe(2000)
      expect(result.total).toBe(8000)
    })

    it('applies invoice-level tax after discount', () => {
      const items = [{ quantity: 1, unitPriceMinor: 10000 }]
      // ₵20 discount, then 10% tax
      const result = calculateInvoiceTotals(items, 2000, 1000)
      expect(result.invoiceTax).toBe(800) // 10% of 8000
      expect(result.total).toBe(8800)
    })

    it('handles PRD acceptance test: 2 items + discount + tax', () => {
      // AT-INV-01: Two items + discount + tax compute correct totals
      const items = [
        { quantity: 5, unitPriceMinor: 10000, taxRateBps: 1250 }, // 5 × ₵100 @ 12.5%
        { quantity: 2, unitPriceMinor: 7500, discountMinor: 1000 }, // 2 × ₵75 - ₵10
      ]
      const result = calculateInvoiceTotals(items)
      
      // Item 1: 50000 + 6250 tax = 56250
      // Item 2: 15000 - 1000 discount = 14000
      expect(result.subtotal).toBe(65000) // 50000 + 15000
      expect(result.itemTax).toBe(6250)
      expect(result.itemDiscount).toBe(1000)
      expect(result.total).toBe(70250) // 65000 - 1000 + 6250
    })
  })

  describe('calculateBalanceDue', () => {
    it('calculates remaining balance', () => {
      expect(calculateBalanceDue(10000, [3000, 2000])).toBe(5000)
      expect(calculateBalanceDue(10000, [10000])).toBe(0)
      expect(calculateBalanceDue(10000, [])).toBe(10000)
    })

    it('does not return negative balance', () => {
      expect(calculateBalanceDue(10000, [15000])).toBe(0)
    })
  })

  describe('validateAmount', () => {
    it('accepts valid amounts', () => {
      expect(validateAmount(0).valid).toBe(true)
      expect(validateAmount(1).valid).toBe(true)
      expect(validateAmount(10000).valid).toBe(true)
    })

    it('rejects negative amounts', () => {
      const result = validateAmount(-100)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('negative')
    })

    it('rejects non-integer amounts', () => {
      const result = validateAmount(12.5)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('whole number')
    })

    it('rejects amounts exceeding max', () => {
      const result = validateAmount(100_000_000_001)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('maximum')
    })
  })
})
