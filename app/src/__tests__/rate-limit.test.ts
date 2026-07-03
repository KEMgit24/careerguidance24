import { describe, it, expect, beforeEach } from 'vitest';
import { SimpleRateLimiter } from '@/lib/rate-limit';

describe('Rate Limiter', () => {
  let limiter: SimpleRateLimiter;

  beforeEach(() => {
    // 100ms window, 3 requests max
    limiter = new SimpleRateLimiter(100, 3);
  });

  it('should allow requests within limit', () => {
    expect(limiter.isAllowed('user1')).toBe(true);
    expect(limiter.isAllowed('user1')).toBe(true);
    expect(limiter.isAllowed('user1')).toBe(true);
  });

  it('should block requests exceeding limit', () => {
    limiter.isAllowed('user2');
    limiter.isAllowed('user2');
    limiter.isAllowed('user2');
    expect(limiter.isAllowed('user2')).toBe(false);
  });

  it('should track different users separately', () => {
    limiter.isAllowed('userA');
    limiter.isAllowed('userA');
    limiter.isAllowed('userB');
    
    expect(limiter.isAllowed('userA')).toBe(true);
    expect(limiter.isAllowed('userB')).toBe(true);
    expect(limiter.isAllowed('userB')).toBe(true);
  });

  it('should return remaining time for rate limited user', () => {
    for (let i = 0; i < 3; i++) {
      limiter.isAllowed('user3');
    }
    
    const remaining = limiter.getRemainingTime('user3');
    expect(remaining).toBeGreaterThan(0);
    expect(remaining).toBeLessThanOrEqual(100);
  });
});
