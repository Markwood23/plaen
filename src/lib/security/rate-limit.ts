/**
 * Simple in-memory rate limiter for auth endpoints
 * For production, consider using Redis or a database
 */

interface RateLimitEntry {
  count: number
  firstRequest: number
  blocked: boolean
  blockedUntil?: number
}

// In-memory store (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Configuration
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 5 // Max requests per window
const BLOCK_DURATION_MS = 30 * 60 * 1000 // 30 minute block after exceeding limit

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.blocked && entry.blockedUntil && entry.blockedUntil < now) {
      rateLimitStore.delete(key)
    } else if (!entry.blocked && entry.firstRequest + WINDOW_MS < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60 * 1000) // Cleanup every minute

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfter?: number
  message?: string
}

/**
 * Check rate limit for a given identifier (usually IP + action)
 */
export function checkRateLimit(identifier: string, options?: {
  maxRequests?: number
  windowMs?: number
  blockDurationMs?: number
}): RateLimitResult {
  const maxRequests = options?.maxRequests || MAX_REQUESTS
  const windowMs = options?.windowMs || WINDOW_MS
  const blockDurationMs = options?.blockDurationMs || BLOCK_DURATION_MS
  
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)
  
  // Check if blocked
  if (entry?.blocked) {
    if (entry.blockedUntil && entry.blockedUntil > now) {
      const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000)
      return {
        allowed: false,
        remaining: 0,
        retryAfter,
        message: `Too many requests. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`
      }
    }
    // Block expired, remove entry
    rateLimitStore.delete(identifier)
  }
  
  // No entry or expired window
  if (!entry || entry.firstRequest + windowMs < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now,
      blocked: false
    })
    return {
      allowed: true,
      remaining: maxRequests - 1
    }
  }
  
  // Within window, increment count
  entry.count++
  
  // Check if exceeded
  if (entry.count > maxRequests) {
    entry.blocked = true
    entry.blockedUntil = now + blockDurationMs
    rateLimitStore.set(identifier, entry)
    
    const retryAfter = Math.ceil(blockDurationMs / 1000)
    return {
      allowed: false,
      remaining: 0,
      retryAfter,
      message: `Too many requests. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`
    }
  }
  
  rateLimitStore.set(identifier, entry)
  return {
    allowed: true,
    remaining: maxRequests - entry.count
  }
}

/**
 * Get rate limit identifier from request
 */
export function getRateLimitIdentifier(request: Request, action: string): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
             request.headers.get('x-real-ip') ||
             'unknown'
  return `${action}:${ip}`
}

/**
 * Rate limit configurations for different actions
 */
export const RATE_LIMITS = {
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 },
  forgotPassword: { maxRequests: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 },
  resetPassword: { maxRequests: 5, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 },
  signup: { maxRequests: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 },
  verifyEmail: { maxRequests: 10, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 },
}
