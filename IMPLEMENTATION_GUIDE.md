# Implementation Guide: Applying Security Pattern to Other Routes

This guide shows how to apply the same security patterns from the chatbot route to other API endpoints.

---

## Pattern Overview

Every API route should follow this structure:

```typescript
import { NextResponse, NextRequest } from "next/server";
import { RelevantSchema } from "@/lib/validation";
import { relevantLimiter, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  // 1. Rate limit check
  if (!relevantLimiter.isAllowed(clientIp)) {
    logger.warn('Rate limit exceeded', { ip: clientIp, endpoint: '/api/...' });
    return rateLimitResponse(relevantLimiter.getRemainingTime(clientIp));
  }

  try {
    // 2. Parse and validate input
    const body = await req.json().catch(() => ({}));
    const validation = RelevantSchema.safeParse(body);

    if (!validation.success) {
      const error = validation.error.errors[0];
      logger.info('Invalid request', { path: error.path?.join('.'), message: error.message });
      return NextResponse.json({ error: `Invalid: ${error.message}` }, { status: 400 });
    }

    const { data } = validation;
    logger.info('Processing valid request', { ip: clientIp });

    // 3. Call service/external API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const result = await callExternalService(data, { signal: controller.signal });
      clearTimeout(timeoutId);
      return NextResponse.json(result);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        logger.warn('Request timeout', { ip: clientIp });
        return NextResponse.json({ error: 'Service timeout' }, { status: 504 });
      }
      throw error;
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    logger.error('API error', error instanceof Error ? error : new Error(errorMsg), { ip: clientIp });

    // 4. Return sanitized error response
    if (errorMsg.includes('timeout')) {
      return NextResponse.json({ error: 'Service timeout' }, { status: 504 });
    } else if (errorMsg.includes('Configuration')) {
      return NextResponse.json({ error: 'Service misconfigured' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Service error' }, { status: 500 });
  }
}
```

---

## TODO: Apply to POST /api/recommendations

**File**: `app/src/app/api/recommendations/route.ts`

### Step 1: Add to validation.ts (if not exists)
Already done: `RecommendationsSchema` exists

### Step 2: Update route.ts

```typescript
import { NextResponse, NextRequest } from "next/server";
import { RecommendationsSchema } from "@/lib/validation";
import { recommendationsLimiter, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  // Rate limit: 50 requests per hour per IP
  if (!recommendationsLimiter.isAllowed(clientIp)) {
    logger.warn('Recommendations rate limit exceeded', { ip: clientIp });
    return rateLimitResponse(recommendationsLimiter.getRemainingTime(clientIp));
  }

  try {
    const body = await req.json().catch(() => ({}));
    const validation = RecommendationsSchema.safeParse(body);

    if (!validation.success) {
      const error = validation.error.errors[0];
      logger.info('Invalid recommendations request', { error: error.message });
      return NextResponse.json({ error: `Invalid input: ${error.message}` }, { status: 400 });
    }

    const { data } = validation;
    logger.info('Processing recommendations request', { userId: data.userId, interests: data.interests?.length });

    // TODO: Implement recommendations logic with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const recommendations = await generateRecommendations(data, { signal: controller.signal });
      clearTimeout(timeoutId);
      return NextResponse.json(recommendations);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json({ error: 'Service timeout' }, { status: 504 });
      }
      throw error;
    }
  } catch (error) {
    logger.error('Recommendations error', error instanceof Error ? error : new Error('Unknown'), { ip: clientIp });
    return NextResponse.json({ error: 'Could not generate recommendations' }, { status: 500 });
  }
}
```

---

## TODO: Apply to POST /api/roadmap

**File**: `app/src/app/api/roadmap/route.ts`

Same pattern as recommendations above, using:
- Schema: `RoadmapSchema`
- Limiter: `roadmapLimiter` (50 req/hour)
- Function: `generateRoadmap()`

---

## TODO: Apply to GET /api/universities

**File**: `app/src/app/api/universities/route.ts`

For GET requests with query parameters:

```typescript
import { NextResponse, NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { universitiesLimiter, getClientIp, rateLimitResponse } from "@/lib/rate-limit"; // Add to rate-limit.ts

export async function GET(req: NextRequest) {
  const clientIp = getClientIp(req);

  // Rate limit: 100 requests per hour
  if (!universitiesLimiter.isAllowed(clientIp)) {
    return rateLimitResponse(universitiesLimiter.getRemainingTime(clientIp));
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q')?.trim() || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);

    if (query.length < 2) {
      return NextResponse.json({ error: 'Search query too short' }, { status: 400 });
    }

    if (query.length > 200) {
      return NextResponse.json({ error: 'Search query too long' }, { status: 400 });
    }

    logger.info('Universities search', { query, limit, ip: clientIp });

    // Fetch universities with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const universities = await searchUniversities(query, limit, { signal: controller.signal });
      clearTimeout(timeoutId);
      return NextResponse.json(universities);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json({ error: 'Search timeout' }, { status: 504 });
      }
      throw error;
    }
  } catch (error) {
    logger.error('Universities search error', error instanceof Error ? error : new Error('Unknown'));
    return NextResponse.json({ error: 'Could not search universities' }, { status: 500 });
  }
}
```

---

## Testing the Security Patterns

### Test 1: Valid Request
```bash
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "Quelles sont les universités au Togo ?"}'
```

**Expected**: 200 OK with JSON response

### Test 2: Invalid Input (Empty)
```bash
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": ""}'
```

**Expected**: 400 Bad Request with error message

### Test 3: Invalid Input (Too Long)
```bash
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "'$(python3 -c "print('a'*5001)')''"}'
```

**Expected**: 400 Bad Request

### Test 4: Rate Limit (Run 101 times)
```bash
for i in {1..101}; do
  curl -X POST http://localhost:3000/api/chatbot \
    -H "Content-Type: application/json" \
    -d '{"message": "test"}' \
    -w "Request $i: %{http_code}\n"
done
```

**Expected**: First 100 return 200, 101st returns 429 Too Many Requests

### Test 5: Timeout (Modify route to delay)
```bash
# Add to route: await new Promise(r => setTimeout(r, 40000))
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'
```

**Expected**: 504 Gateway Timeout

---

## Running Tests

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific test file
npm test validation.test.ts
```

---

## Verification Checklist

- [ ] Input validation schema exists
- [ ] Rate limiter configured in rate-limit.ts
- [ ] getClientIp() used to extract IP
- [ ] Zod schema validation in place
- [ ] Timeout protection added (30s for async, 10s for search)
- [ ] Error handling sanitized (no stack traces)
- [ ] Logging added throughout
- [ ] Returns appropriate HTTP status codes
- [ ] Build compiles without errors (`npm run build`)
- [ ] Tests pass (`npm test`)

---

## Common Issues

### Issue: "Cannot find module '@/lib/validation'"
**Solution**: Check that tsconfig.json has path alias configured for @/

### Issue: "nextRequest is not callable"
**Solution**: Import `NextRequest` from `next/server`

### Issue: Rate limiter shows wrong IP
**Solution**: Check proxy headers in `getClientIp()`:
- x-forwarded-for
- x-real-ip
- cf-connecting-ip

### Issue: "Signal already aborted"
**Solution**: Clear timeout in finally block:
```typescript
finally {
  clearTimeout(timeoutId);
}
```

---

## Performance Notes

**Rate Limiter Memory Usage**: 
- ~1KB per unique IP per 24 hours
- Cleanup: Automatic after time window expires
- For 1M daily users: ~1MB memory

**Validation Overhead**:
- Zod validation: <1ms per request
- Negligible performance impact

**Timeout Overhead**:
- AbortController: <0.1ms
- No performance impact
