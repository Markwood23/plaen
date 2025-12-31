/**
 * Validation Utilities
 * 
 * Common validation functions for forms and API inputs.
 */

/**
 * Validate email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'Email is required' }
  }
  
  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Invalid email format' }
  }
  
  if (email.length > 254) {
    return { valid: false, error: 'Email is too long' }
  }
  
  return { valid: true }
}

/**
 * Validate phone number
 * Supports international formats with optional + prefix
 */
export function validatePhone(phone: string): { valid: boolean; error?: string; normalized?: string } {
  if (!phone || phone.trim() === '') {
    return { valid: false, error: 'Phone number is required' }
  }
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '')
  
  // Must start with + or digit
  if (!cleaned.match(/^[+\d]/)) {
    return { valid: false, error: 'Invalid phone number format' }
  }
  
  // Get just digits for length check
  const digitsOnly = cleaned.replace(/\D/g, '')
  
  // Most phone numbers are 7-15 digits
  if (digitsOnly.length < 7) {
    return { valid: false, error: 'Phone number is too short' }
  }
  
  if (digitsOnly.length > 15) {
    return { valid: false, error: 'Phone number is too long' }
  }
  
  // Ghana specific validation
  if (cleaned.startsWith('+233') || cleaned.startsWith('233')) {
    const ghDigits = cleaned.startsWith('+') ? digitsOnly.slice(3) : digitsOnly.slice(3)
    if (ghDigits.length !== 9) {
      return { valid: false, error: 'Ghana phone number should be 9 digits after country code' }
    }
  }
  
  return { valid: true, normalized: cleaned.startsWith('+') ? cleaned : `+${cleaned}` }
}

/**
 * Validate Ghana mobile money number
 */
export function validateGhanaMoMo(phone: string): { valid: boolean; error?: string; provider?: string } {
  const phoneResult = validatePhone(phone)
  if (!phoneResult.valid) {
    return { valid: false, error: phoneResult.error }
  }
  
  const normalized = phoneResult.normalized!.replace('+233', '0').replace('233', '0')
  
  // Ghana MoMo prefixes
  const mtnPrefixes = ['024', '054', '055', '059']
  const vodafonePrefixes = ['020', '050']
  const airtelTigoPrefixes = ['026', '027', '056', '057']
  
  const prefix = normalized.slice(0, 3)
  
  if (mtnPrefixes.includes(prefix)) {
    return { valid: true, provider: 'MTN' }
  }
  if (vodafonePrefixes.includes(prefix)) {
    return { valid: true, provider: 'Vodafone' }
  }
  if (airtelTigoPrefixes.includes(prefix)) {
    return { valid: true, provider: 'AirtelTigo' }
  }
  
  return { valid: false, error: 'Not a valid Ghana mobile money number' }
}

/**
 * Validate invoice number format
 * Expected: PREFIX-XXXX (e.g., GH-0001, INV-1234)
 */
export function validateInvoiceNumber(invoiceNumber: string): { valid: boolean; error?: string } {
  if (!invoiceNumber || invoiceNumber.trim() === '') {
    return { valid: false, error: 'Invoice number is required' }
  }
  
  const pattern = /^[A-Z]{2,5}-\d{4,6}$/
  
  if (!pattern.test(invoiceNumber.trim().toUpperCase())) {
    return { valid: false, error: 'Invoice number should be in format: PREFIX-XXXX (e.g., GH-0001)' }
  }
  
  return { valid: true }
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): { valid: boolean; error?: string } {
  if (!url || url.trim() === '') {
    return { valid: false, error: 'URL is required' }
  }
  
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'URL must use http or https protocol' }
    }
    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}

/**
 * Validate required string field
 */
export function validateRequired(value: string, fieldName: string = 'This field'): { valid: boolean; error?: string } {
  if (!value || value.trim() === '') {
    return { valid: false, error: `${fieldName} is required` }
  }
  return { valid: true }
}

/**
 * Validate string length
 */
export function validateLength(
  value: string,
  options: { min?: number; max?: number; fieldName?: string }
): { valid: boolean; error?: string } {
  const { min = 0, max = Infinity, fieldName = 'This field' } = options
  
  if (value.length < min) {
    return { valid: false, error: `${fieldName} must be at least ${min} characters` }
  }
  
  if (value.length > max) {
    return { valid: false, error: `${fieldName} must be no more than ${max} characters` }
  }
  
  return { valid: true }
}

/**
 * Validate date is in the future
 */
export function validateFutureDate(date: Date | string, fieldName: string = 'Date'): { valid: boolean; error?: string } {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (d < today) {
    return { valid: false, error: `${fieldName} must be today or in the future` }
  }
  
  return { valid: true }
}

/**
 * Validate date range
 */
export function validateDateRange(
  startDate: Date | string,
  endDate: Date | string
): { valid: boolean; error?: string } {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  
  if (end < start) {
    return { valid: false, error: 'End date must be after start date' }
  }
  
  return { valid: true }
}

/**
 * Validate tax rate (basis points: 0-10000)
 */
export function validateTaxRate(rateBps: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(rateBps)) {
    return { valid: false, error: 'Tax rate must be a whole number' }
  }
  
  if (rateBps < 0) {
    return { valid: false, error: 'Tax rate cannot be negative' }
  }
  
  if (rateBps > 10000) {
    return { valid: false, error: 'Tax rate cannot exceed 100%' }
  }
  
  return { valid: true }
}
