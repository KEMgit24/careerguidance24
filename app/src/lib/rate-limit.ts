import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Simple in-memory rate limiter for development/testing
 * In production, use Redis or Upstash
 */
export class SimpleRateLimiter {
  private store: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly windowMs: number; // milliseconds
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || now > record.resetTime) {
      // New window
      this.store.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (record.count < this.maxRequests) {
      record.count++;
      return true;
    }

    return false;
  }

  getRemainingTime(key: string): number {
    const record = this.store.get(key);
    if (!record) return 0;
    return Math.max(0, record.resetTime - Date.now());
  }
}

// Create instances for different endpoints
export const chatbotLimiter = new SimpleRateLimiter(3600000, 100); // 100 requests per hour
export const recommendationsLimiter = new SimpleRateLimiter(3600000, 50); // 50 requests per hour
export const roadmapLimiter = new SimpleRateLimiter(3600000, 50); // 50 requests per hour

/**
 * Rate limit middleware
 * Usage: if (!rateLimitCheck(ip, limiter)) return rateLimitResponse(remaining);
 */
export function rateLimitCheck(identifier: string, limiter: SimpleRateLimiter): boolean {
  return limiter.isAllowed(identifier);
}

export function rateLimitResponse(remainingTime: number) {
  const retryAfter = Math.ceil(remainingTime / 1000);
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Remaining': '0',
      }
    }
  );
}

/**
 * Extract client IP from request
 */
export function getClientIp(request: NextRequest | Request): string {
  const headersList = request.headers;
  return (
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
    headersList.get('x-real-ip') ||
    headersList.get('cf-connecting-ip') ||
    'unknown'
  );
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < maxRetries - 1) {
        const delay = baseDelayMs * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}
