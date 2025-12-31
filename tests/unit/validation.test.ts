import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePhone,
  validateGhanaMoMo,
  validateInvoiceNumber,
  validateUrl,
  validateRequired,
  validateLength,
  validateFutureDate,
  validateDateRange,
  validateTaxRate,
} from '@/lib/utils/validation'

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('accepts valid emails', () => {
      expect(validateEmail('test@example.com').valid).toBe(true)
      expect(validateEmail('user.name@domain.co.uk').valid).toBe(true)
      expect(validateEmail('user+tag@example.org').valid).toBe(true)
    })

    it('rejects invalid emails', () => {
      expect(validateEmail('').valid).toBe(false)
      expect(validateEmail('notanemail').valid).toBe(false)
      expect(validateEmail('missing@domain').valid).toBe(false)
      expect(validateEmail('@nodomain.com').valid).toBe(false)
    })

    it('rejects too-long emails', () => {
      const longEmail = 'a'.repeat(250) + '@b.com'
      expect(validateEmail(longEmail).valid).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('accepts valid phone numbers', () => {
      expect(validatePhone('+1234567890').valid).toBe(true)
      expect(validatePhone('+233244123456').valid).toBe(true)
      expect(validatePhone('0244123456').valid).toBe(true)
    })

    it('normalizes phone numbers', () => {
      const result = validatePhone('0244123456')
      expect(result.normalized).toBe('+0244123456')
    })

    it('rejects too-short numbers', () => {
      expect(validatePhone('123').valid).toBe(false)
    })

    it('rejects too-long numbers', () => {
      expect(validatePhone('+1234567890123456').valid).toBe(false)
    })
  })

  describe('validateGhanaMoMo', () => {
    it('identifies MTN numbers', () => {
      const result = validateGhanaMoMo('+233244123456')
      expect(result.valid).toBe(true)
      expect(result.provider).toBe('MTN')
    })

    it('identifies Vodafone numbers', () => {
      const result = validateGhanaMoMo('+233201234567')
      expect(result.valid).toBe(true)
      expect(result.provider).toBe('Vodafone')
    })

    it('identifies AirtelTigo numbers', () => {
      const result = validateGhanaMoMo('+233261234567')
      expect(result.valid).toBe(true)
      expect(result.provider).toBe('AirtelTigo')
    })

    it('rejects non-MoMo numbers', () => {
      expect(validateGhanaMoMo('+233301234567').valid).toBe(false)
    })
  })

  describe('validateInvoiceNumber', () => {
    it('accepts valid formats', () => {
      expect(validateInvoiceNumber('GH-0001').valid).toBe(true)
      expect(validateInvoiceNumber('INV-1234').valid).toBe(true)
      expect(validateInvoiceNumber('ACME-123456').valid).toBe(true)
    })

    it('rejects invalid formats', () => {
      expect(validateInvoiceNumber('').valid).toBe(false)
      expect(validateInvoiceNumber('1234').valid).toBe(false)
      expect(validateInvoiceNumber('GH0001').valid).toBe(false)
      expect(validateInvoiceNumber('G-001').valid).toBe(false)
    })
  })

  describe('validateUrl', () => {
    it('accepts valid URLs', () => {
      expect(validateUrl('https://example.com').valid).toBe(true)
      expect(validateUrl('http://test.org/path').valid).toBe(true)
      expect(validateUrl('https://sub.domain.com/path?query=1').valid).toBe(true)
    })

    it('rejects invalid URLs', () => {
      expect(validateUrl('').valid).toBe(false)
      expect(validateUrl('not-a-url').valid).toBe(false)
      expect(validateUrl('ftp://example.com').valid).toBe(false)
    })
  })

  describe('validateRequired', () => {
    it('accepts non-empty strings', () => {
      expect(validateRequired('hello').valid).toBe(true)
    })

    it('rejects empty strings', () => {
      expect(validateRequired('').valid).toBe(false)
      expect(validateRequired('   ').valid).toBe(false)
    })

    it('uses custom field name in error', () => {
      const result = validateRequired('', 'Name')
      expect(result.error).toContain('Name')
    })
  })

  describe('validateLength', () => {
    it('accepts strings within range', () => {
      expect(validateLength('hello', { min: 3, max: 10 }).valid).toBe(true)
    })

    it('rejects too-short strings', () => {
      expect(validateLength('hi', { min: 3 }).valid).toBe(false)
    })

    it('rejects too-long strings', () => {
      expect(validateLength('hello world', { max: 5 }).valid).toBe(false)
    })
  })

  describe('validateFutureDate', () => {
    it('accepts future dates', () => {
      const tomorrow = new Date(Date.now() + 86400000)
      expect(validateFutureDate(tomorrow).valid).toBe(true)
    })

    it('accepts today', () => {
      const today = new Date()
      expect(validateFutureDate(today).valid).toBe(true)
    })

    it('rejects past dates', () => {
      const yesterday = new Date(Date.now() - 86400000)
      expect(validateFutureDate(yesterday).valid).toBe(false)
    })
  })

  describe('validateDateRange', () => {
    it('accepts valid range', () => {
      const start = new Date('2025-01-01')
      const end = new Date('2025-01-31')
      expect(validateDateRange(start, end).valid).toBe(true)
    })

    it('accepts same day', () => {
      const date = new Date('2025-01-15')
      expect(validateDateRange(date, date).valid).toBe(true)
    })

    it('rejects inverted range', () => {
      const start = new Date('2025-01-31')
      const end = new Date('2025-01-01')
      expect(validateDateRange(start, end).valid).toBe(false)
    })
  })

  describe('validateTaxRate', () => {
    it('accepts valid rates', () => {
      expect(validateTaxRate(0).valid).toBe(true)
      expect(validateTaxRate(1250).valid).toBe(true) // 12.5%
      expect(validateTaxRate(10000).valid).toBe(true) // 100%
    })

    it('rejects negative rates', () => {
      expect(validateTaxRate(-100).valid).toBe(false)
    })

    it('rejects rates over 100%', () => {
      expect(validateTaxRate(10001).valid).toBe(false)
    })

    it('rejects non-integer rates', () => {
      expect(validateTaxRate(12.5).valid).toBe(false)
    })
  })
})
