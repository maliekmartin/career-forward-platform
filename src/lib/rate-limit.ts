/**
 * Rate limiting utility for API routes
 * Uses in-memory storage - for production scale, consider Redis
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// Store rate limit data in memory (per-process)
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up old entries periodically
const CLEANUP_THRESHOLD = 10000;

function cleanupOldEntries() {
  if (rateLimitStore.size > CLEANUP_THRESHOLD) {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for an identifier (e.g., userId, IP address)
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanupOldEntries();

  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // Reset if window expired or no record exists
  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(identifier, newRecord);
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetAt: newRecord.resetTime,
    };
  }

  // Check if limit exceeded
  if (record.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetTime,
    };
  }

  // Increment counter
  record.count++;
  return {
    success: true,
    remaining: config.maxRequests - record.count,
    resetAt: record.resetTime,
  };
}

/**
 * Pre-configured rate limits for different endpoints
 */
export const RATE_LIMITS = {
  // Resume operations
  RESUME_CREATE: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
  RESUME_UPDATE: { maxRequests: 60, windowMs: 60 * 60 * 1000 }, // 60 per hour
  RESUME_UPLOAD: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour

  // AI operations (expensive)
  AI_GENERATE: { maxRequests: 20, windowMs: 60 * 60 * 1000 }, // 20 per hour
  AI_ENHANCE: { maxRequests: 30, windowMs: 60 * 60 * 1000 }, // 30 per hour
  AI_PARSE: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour

  // General API
  GENERAL: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 per minute
} as const;

/**
 * Create rate limit key with prefix
 */
export function createRateLimitKey(
  prefix: string,
  userId: string,
  ip?: string
): string {
  return `${prefix}:${userId}${ip ? `:${ip}` : ""}`;
}
