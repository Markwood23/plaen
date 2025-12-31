/**
 * Rate Limiting Utility
 * 
 * Simple in-memory rate limiter for API routes.
 * For production, consider using Redis or Upstash for distributed rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
  /** Identifier prefix (e.g., 'auth', 'api', 'webhook') */
  prefix?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

/**
 * Check and update rate limit for a given identifier
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const { limit, windowSeconds, prefix = 'default' } = config;
  const key = `${prefix}:${identifier}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  
  let entry = rateLimitStore.get(key);
  
  // If no entry or window expired, create new entry
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(key, entry);
    
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetAt: entry.resetAt,
    };
  }
  
  // Increment count
  entry.count++;
  
  // Check if over limit
  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter,
    };
  }
  
  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Get client identifier from request
 * Uses IP address with fallback to user ID or anonymous
 */
export function getClientIdentifier(request: Request, userId?: string): string {
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = cfConnectingIp || realIp || forwardedFor?.split(',')[0]?.trim() || 'unknown';
  
  // Combine IP with user ID for authenticated requests
  if (userId) {
    return `${ip}:${userId}`;
  }
  
  return ip;
}

/**
 * Pre-configured rate limits for different endpoints
 */
export const RATE_LIMITS = {
  // Auth endpoints - stricter limits
  auth: {
    login: { limit: 5, windowSeconds: 60, prefix: 'auth:login' },        // 5 attempts per minute
    signup: { limit: 3, windowSeconds: 60, prefix: 'auth:signup' },      // 3 signups per minute
    forgotPassword: { limit: 3, windowSeconds: 300, prefix: 'auth:forgot' }, // 3 per 5 minutes
    verifyOtp: { limit: 5, windowSeconds: 60, prefix: 'auth:otp' },      // 5 attempts per minute
  },
  
  // API endpoints - standard limits
  api: {
    read: { limit: 100, windowSeconds: 60, prefix: 'api:read' },         // 100 reads per minute
    write: { limit: 30, windowSeconds: 60, prefix: 'api:write' },        // 30 writes per minute
    upload: { limit: 10, windowSeconds: 60, prefix: 'api:upload' },      // 10 uploads per minute
  },
  
  // Payment endpoints - moderate limits
  payment: {
    initiate: { limit: 10, windowSeconds: 60, prefix: 'pay:init' },      // 10 payment initiations per minute
    webhook: { limit: 100, windowSeconds: 60, prefix: 'pay:webhook' },   // Allow webhook bursts
  },
  
  // Email endpoints
  email: {
    send: { limit: 20, windowSeconds: 60, prefix: 'email:send' },        // 20 emails per minute
    reminder: { limit: 10, windowSeconds: 300, prefix: 'email:remind' }, // 10 reminders per 5 minutes
  },
} as const;

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetAt / 1000).toString(),
  };
  
  if (result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }
  
  return headers;
}

/**
 * Helper to create a rate-limited response
 */
export function rateLimitedResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`,
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...createRateLimitHeaders(result),
      },
    }
  );
}
