[**next-limit**](../README.md)

***

[next-limit](../README.md) / RateLimiterConfig

# Interface: RateLimiterConfig\<T\>

Defined in: [src/factories.ts:46](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L46)

Configuration for the main rate limiter.

## Type Parameters

### T

`T` *extends* [`RateLimitStrategy`](RateLimitStrategy.md)

## Properties

### onError?

> `optional` **onError**: `"allow"` \| `"deny"` \| `"throw"`

Defined in: [src/factories.ts:73](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L73)

The policy to apply when an error occurs in the storage backend.
- `throw`: Rethrow the error (default).
- `allow`: Allow the request to proceed.
- `deny`: Deny the request.

***

### prefix?

> `optional` **prefix**: `string`

Defined in: [src/factories.ts:65](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L65)

A unique prefix for storage keys to avoid collisions.
If not provided, a unique prefix will be generated.

***

### storage

> **storage**: [`Storage`](Storage.md)

Defined in: [src/factories.ts:59](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L59)

The storage backend to use for tracking requests.

#### See

 - createMemoryStorage
 - createRedisStorage

***

### strategy

> **strategy**: [`StrategyFactory`](StrategyFactory.md)\<`T`\>

Defined in: [src/factories.ts:52](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L52)

The strategy factory to use for rate limiting.

#### See

 - createFixedWindowStrategy
 - createSlidingWindowStrategy
