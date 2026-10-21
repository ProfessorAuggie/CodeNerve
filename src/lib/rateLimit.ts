/**
 * In-memory sliding-window rate limiter for Next.js App Router API routes.
 * Protects authentication and critical endpoints from brute force attacks and DoS.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Periodic cleanup of stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export interface RateLimitOptions {
  limit?: number; // Max requests allowed within window (default: 10)
  windowMs?: number; // Window size in ms (default: 60,000 = 1 minute)
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

export function checkRateLimit(
  req: Request,
  actionKey: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit ?? 10;
  const windowMs = options.windowMs ?? 60 * 1000;
  const ip = getClientIp(req);
  const key = `${actionKey}:${ip}`;

  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // New window
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  // Existing window
  record.count += 1;
  const resetInSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));

  if (record.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  return {
    allowed: true,
    remaining: limit - record.count,
    resetInSeconds,
  };
}
