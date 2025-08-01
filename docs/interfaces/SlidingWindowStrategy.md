[**next-limit**](../README.md)

***

[next-limit](../README.md) / SlidingWindowStrategy

# Interface: SlidingWindowStrategy

Defined in: [src/core/strategy.ts:173](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/strategy.ts#L173)

Implements the Sliding Window rate limiting strategy using a generic storage backend.

The sliding window strategy provides a more accurate rate limiting approach by
considering the request rate over a rolling time window. It uses a sorted set
to track request timestamps and allows a maximum number of requests within
any window of the specified duration.

This strategy is more accurate than the fixed window approach but requires
more storage and computation (O(log n) time complexity for Redis operations).
It prevents the "2x limit" issue of the fixed window strategy.

## Example

```typescript
const storage = new MemoryStorage();
const strategy = new SlidingWindowStrategy(storage, 'rate-limit:', 60000, 100);
const result = await strategy.limit('user-123');
if (!result.allowed) {
  console.log(`Rate limit exceeded. Try again in ${Math.ceil(result.reset / 1000)} seconds`);
}
```

## Implements

- [`RateLimitStrategy`](RateLimitStrategy.md)

## Methods

### limit()

> **limit**(`identifier`): `Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

Defined in: [src/core/strategy.ts:205](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/strategy.ts#L205)

Checks if a request is allowed based on the sliding window rate limiting rules.

#### Parameters

##### identifier

`string`

A unique string identifying the client (e.g., IP address).

#### Returns

`Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

A promise that resolves to a `RateLimiterResult` indicating whether the request is allowed.

#### Implementation of

`RateLimitStrategy.limit`
