import { describe, it, expect } from 'vitest'
import {
  createCanonicalJSON,
  calculateHash,
  getHashTail,
  generateReceiptSnapshot,
  verifyReceiptHash,
  buildReceiptHashData,
  ReceiptHashData,
} from '@/lib/utils/receipt-hash'

// Fixture: sample receipt data for testing
const sampleReceiptData: ReceiptHashData = {
  invoice_id: 'inv-123-abc',
  invoice_number: 'GH-0001',
  issue_date: '2025-01-01',
  due_date: '2025-01-15',
  currency: 'GHS',
  items: [
    {
      label: 'Web Development Services',
      quantity: 10,
      unit_price_minor: 50000,
      line_total_minor: 500000,
    },
    {
      label: 'Domain Registration',
      quantity: 1,
      unit_price_minor: 15000,
      line_total_minor: 15000,
    },
  ],
  subtotal_minor: 515000,
  discount_minor: 15000,
  tax_minor: 62500,
  total_minor: 562500,
  payments: [
    {
      id: 'pay-001',
      amount_minor: 562500,
      rail: 'momo',
      paid_at: '2025-01-02T10:30:00.000Z',
      reference: 'FLW-12345',
    },
  ],
  issuer: {
    name: 'Acme Corp',
    email: 'billing@acme.gh',
  },
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
  },
  snapshot_version: 1,
  created_at: '2025-01-02T10:35:00.000Z',
}

describe('Receipt Hash Generation', () => {
  describe('createCanonicalJSON', () => {
    it('produces deterministic output', () => {
      const json1 = createCanonicalJSON(sampleReceiptData)
      const json2 = createCanonicalJSON(sampleReceiptData)
      
      expect(json1).toBe(json2)
    })

    it('sorts keys alphabetically', () => {
      const data = {
        zebra: 1,
        apple: 2,
        mango: 3,
      } as unknown as ReceiptHashData
      
      const json = createCanonicalJSON(data)
      const parsed = JSON.parse(json)
      const keys = Object.keys(parsed)
      
      expect(keys).toEqual(['apple', 'mango', 'zebra'])
    })

    it('sorts nested object keys', () => {
      const json = createCanonicalJSON(sampleReceiptData)
      
      // Check that issuer keys are sorted (email before name)
      expect(json).toContain('"issuer":{"email":"billing@acme.gh","name":"Acme Corp"}')
    })

    it('preserves array order', () => {
      const json = createCanonicalJSON(sampleReceiptData)
      
      // First item should come before second
      expect(json.indexOf('Web Development')).toBeLessThan(json.indexOf('Domain Registration'))
    })

    it('handles null and undefined values', () => {
      const dataWithNull = {
        ...sampleReceiptData,
        extra: null,
      } as unknown as ReceiptHashData
      
      const json = createCanonicalJSON(dataWithNull)
      expect(json).toContain('"extra":null')
    })

    it('produces compact JSON without whitespace', () => {
      const json = createCanonicalJSON(sampleReceiptData)
      
      // No newlines or extra spaces
      expect(json).not.toMatch(/\n/)
      expect(json).not.toMatch(/": /)
    })
  })

  describe('calculateHash', () => {
    it('returns 64-character hex string', () => {
      const json = createCanonicalJSON(sampleReceiptData)
      const hash = calculateHash(json)
      
      expect(hash).toHaveLength(64)
      expect(hash).toMatch(/^[a-f0-9]+$/)
    })

    it('produces consistent hash for same input', () => {
      const json = createCanonicalJSON(sampleReceiptData)
      const hash1 = calculateHash(json)
      const hash2 = calculateHash(json)
      
      expect(hash1).toBe(hash2)
    })

    it('produces different hash for different input', () => {
      const json1 = createCanonicalJSON(sampleReceiptData)
      const modifiedData = { ...sampleReceiptData, total_minor: 999999 }
      const json2 = createCanonicalJSON(modifiedData)
      
      const hash1 = calculateHash(json1)
      const hash2 = calculateHash(json2)
      
      expect(hash1).not.toBe(hash2)
    })

    it('is sensitive to minor changes', () => {
      const json1 = createCanonicalJSON(sampleReceiptData)
      const modifiedData = {
        ...sampleReceiptData,
        issuer: { ...sampleReceiptData.issuer, name: 'Acme Corp.' }, // Added period
      }
      const json2 = createCanonicalJSON(modifiedData)
      
      expect(calculateHash(json1)).not.toBe(calculateHash(json2))
    })
  })

  describe('getHashTail', () => {
    it('returns last 8 characters by default', () => {
      const hash = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8'
      const tail = getHashTail(hash)
      
      expect(tail).toHaveLength(8)
      expect(tail).toBe('y5z6a7b8')
    })

    it('respects custom length', () => {
      const hash = 'abcdefghijklmnop'
      
      expect(getHashTail(hash, 4)).toBe('mnop')
      expect(getHashTail(hash, 12)).toBe('efghijklmnop')
    })
  })

  describe('generateReceiptSnapshot', () => {
    it('returns complete snapshot object', () => {
      const snapshot = generateReceiptSnapshot(sampleReceiptData)
      
      expect(snapshot).toHaveProperty('canonical_json')
      expect(snapshot).toHaveProperty('sha256_hash')
      expect(snapshot).toHaveProperty('hash_tail')
    })

    it('hash_tail matches end of sha256_hash', () => {
      const snapshot = generateReceiptSnapshot(sampleReceiptData)
      
      expect(snapshot.sha256_hash.endsWith(snapshot.hash_tail)).toBe(true)
    })

    it('canonical_json is parseable', () => {
      const snapshot = generateReceiptSnapshot(sampleReceiptData)
      
      expect(() => JSON.parse(snapshot.canonical_json)).not.toThrow()
    })
  })

  describe('verifyReceiptHash', () => {
    it('returns valid=true for matching hash', () => {
      const snapshot = generateReceiptSnapshot(sampleReceiptData)
      const result = verifyReceiptHash(sampleReceiptData, snapshot.sha256_hash)
      
      expect(result.valid).toBe(true)
      expect(result.computedHash).toBe(snapshot.sha256_hash)
    })

    it('returns valid=false for mismatched hash', () => {
      const result = verifyReceiptHash(sampleReceiptData, 'invalid_hash_value')
      
      expect(result.valid).toBe(false)
    })

    it('detects data tampering', () => {
      const snapshot = generateReceiptSnapshot(sampleReceiptData)
      
      // Tamper with the data
      const tamperedData = {
        ...sampleReceiptData,
        total_minor: 100, // Changed from 562500
      }
      
      const result = verifyReceiptHash(tamperedData, snapshot.sha256_hash)
      
      expect(result.valid).toBe(false)
    })
  })

  describe('buildReceiptHashData', () => {
    it('constructs proper receipt hash data structure', () => {
      const invoice = {
        id: 'inv-test',
        invoice_number: 'GH-0042',
        issue_date: '2025-01-01',
        due_date: '2025-01-31',
        currency: 'GHS',
        subtotal: 100000,
        discount: 0,
        tax: 12500,
        total: 112500,
      }
      
      const items = [
        { label: 'Service', quantity: 1, unit_price_minor: 100000, line_total_minor: 100000 },
      ]
      
      const payments = [
        { id: 'pay-1', amount_minor: 112500, rail: 'bank', paid_at: '2025-01-05T12:00:00Z', reference: 'REF123' },
      ]
      
      const issuer = { name: 'My Business', email: 'me@biz.com' }
      const customer = { name: 'Client', email: 'client@co.com' }
      
      const result = buildReceiptHashData(invoice, items, payments, issuer, customer, 1)
      
      expect(result.invoice_id).toBe('inv-test')
      expect(result.invoice_number).toBe('GH-0042')
      expect(result.items).toHaveLength(1)
      expect(result.payments).toHaveLength(1)
      expect(result.snapshot_version).toBe(1)
      expect(result.created_at).toBeDefined()
    })
  })

  describe('Hash Stability Across Environments', () => {
    // AT-DOC-01: Snapshot hash stable across environments
    it('produces known hash for known input (regression test)', () => {
      // This test ensures hash stability - if this fails, hash algorithm changed
      const fixedData: ReceiptHashData = {
        invoice_id: 'test-invoice-001',
        invoice_number: 'TEST-0001',
        issue_date: '2025-01-01',
        due_date: '2025-01-15',
        currency: 'USD',
        items: [
          { label: 'Item A', quantity: 2, unit_price_minor: 5000, line_total_minor: 10000 },
        ],
        subtotal_minor: 10000,
        discount_minor: 0,
        tax_minor: 0,
        total_minor: 10000,
        payments: [],
        issuer: { name: 'Test Issuer', email: 'test@issuer.com' },
        customer: { name: 'Test Customer', email: 'test@customer.com' },
        snapshot_version: 1,
        created_at: '2025-01-01T00:00:00.000Z',
      }
      
      const snapshot = generateReceiptSnapshot(fixedData)
      
      // This hash should remain constant across all environments
      // If this test fails, the hash algorithm or canonical JSON has changed
      // Known stable hash for this exact input:
      expect(snapshot.sha256_hash).toBe(
        '7ce9284161bf6c6ee274494b7651268f90a0fad47c21f8f98cc9b013261f30dd'
      )
      
      // Verify structure is consistent
      expect(snapshot.sha256_hash).toHaveLength(64)
    })

    it('hash is independent of property insertion order', () => {
      // Create same data with different property order
      const data1: ReceiptHashData = {
        invoice_id: 'x',
        invoice_number: 'y',
        issue_date: 'a',
        due_date: 'b',
        currency: 'c',
        items: [],
        subtotal_minor: 0,
        discount_minor: 0,
        tax_minor: 0,
        total_minor: 0,
        payments: [],
        issuer: { name: 'n', email: 'e' },
        customer: { name: 'n', email: 'e' },
        snapshot_version: 1,
        created_at: 'z',
      }
      
      // Same data but different construction order
      const data2 = {} as ReceiptHashData
      data2.customer = { email: 'e', name: 'n' }
      data2.issuer = { name: 'n', email: 'e' }
      data2.created_at = 'z'
      data2.snapshot_version = 1
      data2.payments = []
      data2.total_minor = 0
      data2.tax_minor = 0
      data2.discount_minor = 0
      data2.subtotal_minor = 0
      data2.items = []
      data2.currency = 'c'
      data2.due_date = 'b'
      data2.issue_date = 'a'
      data2.invoice_number = 'y'
      data2.invoice_id = 'x'
      
      const hash1 = calculateHash(createCanonicalJSON(data1))
      const hash2 = calculateHash(createCanonicalJSON(data2))
      
      expect(hash1).toBe(hash2)
    })
  })
})
