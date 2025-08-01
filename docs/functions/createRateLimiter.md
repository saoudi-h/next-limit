[**next-limit**](../README.md)

***

[next-limit](../README.md) / createRateLimiter

# Function: createRateLimiter()

> **createRateLimiter**\<`T`\>(`config`): [`RateLimiterInstance`](../interfaces/RateLimiterInstance.md)

Defined in: [src/factories.ts:217](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L217)

Creates and configures a rate limiter instance.

## Type Parameters

### T

`T` *extends* [`RateLimitStrategy`](../interfaces/RateLimitStrategy.md)

## Parameters

### config

[`RateLimiterConfig`](../interfaces/RateLimiterConfig.md)\<`T`\>

## Returns

[`RateLimiterInstance`](../interfaces/RateLimiterInstance.md)

## Example

```ts
const limiter = createRateLimiter({
  strategy: createFixedWindowStrategy({ windowMs: '1m', limit: 100 }),
  storage: createMemoryStorage(),
  prefix: 'my-app',
});

const { success } = await limiter.limit('user-123');
if (!success) {
  // Rate limit exceeded
}
```
