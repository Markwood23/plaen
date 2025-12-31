/**
 * Receipt Hash Generation Utilities
 * 
 * Generates deterministic, verifiable hashes for receipt snapshots.
 * Uses canonical JSON to ensure hash stability across environments.
 */

import { createHash } from 'crypto'

/**
 * Receipt data structure for hash generation
 */
export interface ReceiptHashData {
  invoice_id: string
  invoice_number: string
  issue_date: string
  due_date: string
  currency: string
  items: Array<{
    label: string
    quantity: number
    unit_price_minor: number
    line_total_minor: number
  }>
  subtotal_minor: number
  discount_minor: number
  tax_minor: number
  total_minor: number
  payments: Array<{
    id: string
    amount_minor: number
    rail: string
    paid_at: string
    reference: string
  }>
  issuer: {
    name: string
    email: string
  }
  customer: {
    name: string
    email: string
  }
  snapshot_version: number
  created_at: string
}

/**
 * Convert receipt data to canonical JSON format
 * 
 * Rules for canonical JSON:
 * - Keys are sorted alphabetically at all levels
 * - No whitespace between elements
 * - Numbers represented without trailing zeros
 * - Strings use double quotes with minimal escaping
 * - Arrays maintain original order
 */
export function createCanonicalJSON(data: ReceiptHashData): string {
  return JSON.stringify(sortObjectKeys(data))
}

/**
 * Recursively sort object keys alphabetically
 */
function sortObjectKeys(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys)
  }
  
  if (typeof obj === 'object') {
    const sorted: Record<string, unknown> = {}
    const keys = Object.keys(obj as Record<string, unknown>).sort()
    
    for (const key of keys) {
      sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key])
    }
    
    return sorted
  }
  
  return obj
}

/**
 * Calculate SHA-256 hash of canonical JSON
 * Returns full 64-character hex string
 */
export function calculateHash(canonicalJson: string): string {
  return createHash('sha256').update(canonicalJson, 'utf8').digest('hex')
}

/**
 * Get hash tail (last N characters) for display
 */
export function getHashTail(hash: string, length: number = 8): string {
  return hash.slice(-length)
}

/**
 * Generate complete receipt snapshot
 */
export function generateReceiptSnapshot(data: ReceiptHashData): {
  canonical_json: string
  sha256_hash: string
  hash_tail: string
} {
  const canonical_json = createCanonicalJSON(data)
  const sha256_hash = calculateHash(canonical_json)
  const hash_tail = getHashTail(sha256_hash)
  
  return {
    canonical_json,
    sha256_hash,
    hash_tail,
  }
}

/**
 * Verify a receipt against its stored hash
 */
export function verifyReceiptHash(
  data: ReceiptHashData,
  storedHash: string
): { valid: boolean; computedHash: string } {
  const canonical_json = createCanonicalJSON(data)
  const computedHash = calculateHash(canonical_json)
  
  return {
    valid: computedHash === storedHash,
    computedHash,
  }
}

/**
 * Create receipt hash data from database records
 */
export function buildReceiptHashData(
  invoice: {
    id: string
    invoice_number: string
    issue_date: string
    due_date: string
    currency: string
    subtotal: number
    discount: number
    tax: number
    total: number
  },
  items: Array<{
    label: string
    quantity: number
    unit_price_minor: number
    line_total_minor: number
  }>,
  payments: Array<{
    id: string
    amount_minor: number
    rail: string
    paid_at: string
    reference: string
  }>,
  issuer: { name: string; email: string },
  customer: { name: string; email: string },
  version: number = 1
): ReceiptHashData {
  return {
    invoice_id: invoice.id,
    invoice_number: invoice.invoice_number,
    issue_date: invoice.issue_date,
    due_date: invoice.due_date,
    currency: invoice.currency,
    items: items.map(item => ({
      label: item.label,
      quantity: item.quantity,
      unit_price_minor: item.unit_price_minor,
      line_total_minor: item.line_total_minor,
    })),
    subtotal_minor: invoice.subtotal,
    discount_minor: invoice.discount,
    tax_minor: invoice.tax,
    total_minor: invoice.total,
    payments: payments.map(p => ({
      id: p.id,
      amount_minor: p.amount_minor,
      rail: p.rail,
      paid_at: p.paid_at,
      reference: p.reference,
    })),
    issuer: {
      name: issuer.name,
      email: issuer.email,
    },
    customer: {
      name: customer.name,
      email: customer.email,
    },
    snapshot_version: version,
    created_at: new Date().toISOString(),
  }
}
