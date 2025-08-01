[**next-limit**](../README.md)

***

[next-limit](../README.md) / createRateLimiter

# Function: createRateLimiter()

> **createRateLimiter**(`options`): [`RateLimiterInstance`](../interfaces/RateLimiterInstance.md)

Defined in: [factories.ts:207](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L207)

Creates and configures a new rate limiter instance.
This is the main entry point for using the library.

The createRateLimiter function takes a configuration object that specifies
the rate limiting strategy, storage backend, optional prefix, and error handling policy.
It returns a RateLimiterInstance that can be used to check if requests are allowed.

## Parameters

### options

[`CreateRateLimiterOptions`](../interfaces/CreateRateLimiterOptions.md)

The options for the rate limiter.

## Returns

[`RateLimiterInstance`](../interfaces/RateLimiterInstance.md)

A `RateLimiterInstance` ready to be used.

## Example

```typescript
const storage = createMemoryStorage();
const strategyFactory = createFixedWindowStrategy({
  windowMs: 60000, // 1 minute
  limit: 100,      // 100 requests per minute
});

const limiter = createRateLimiter({
  strategy: strategyFactory,
  storage: storage,
  prefix: 'my-app', // Optional prefix
  onError: 'deny'   // Default behavior
});

// Use the limiter
const result = await limiter.consume('user-id');
if (result.allowed) {
  // Process the request
} else {
  // Reject the request
}
```
