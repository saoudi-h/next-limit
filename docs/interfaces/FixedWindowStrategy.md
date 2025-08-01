[**next-limit**](../README.md)

***

[next-limit](../README.md) / FixedWindowStrategy

# Interface: FixedWindowStrategy

Defined in: [src/core/strategy.ts:102](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/strategy.ts#L102)

Implements the Fixed Window rate limiting strategy using a generic storage backend.

The fixed window strategy divides time into fixed intervals (windows) and allows
a maximum number of requests within each window. Once the limit is reached,
subsequent requests are denied until the next window begins.

This strategy is simple and efficient, with constant time complexity O(1) for
both memory and computation. However, it can allow up to 2x the limit in a
short period when traffic spikes occur at window boundaries.

## Example

```typescript
const storage = new MemoryStorage();
const strategy = new FixedWindowStrategy(storage, 'rate-limit:', 60000, 100);
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

Defined in: [src/core/strategy.ts:134](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/strategy.ts#L134)

Checks if a request is allowed based on the fixed window rate limiting rules.

#### Parameters

##### identifier

`string`

A unique string identifying the client (e.g., IP address).

#### Returns

`Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

A promise that resolves to a `RateLimiterResult` indicating whether the request is allowed.

#### Implementation of

`RateLimitStrategy.limit`
