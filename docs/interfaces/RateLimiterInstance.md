[**next-limit**](../README.md)

***

[next-limit](../README.md) / RateLimiterInstance

# Interface: RateLimiterInstance

Defined in: [core/rate-limiter.ts:12](https://github.com/saoudi-h/next-limit/blob/527d4e765919035965098773f4a5584e6ee0095b/src/core/rate-limiter.ts#L12)

Defines the public interface for a rate limiter instance.
This is what the factory function `createRateLimiter` will return.

## Methods

### consume()

> **consume**(`identifier`): `Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

Defined in: [core/rate-limiter.ts:20](https://github.com/saoudi-h/next-limit/blob/527d4e765919035965098773f4a5584e6ee0095b/src/core/rate-limiter.ts#L20)

Consumes a point for a given identifier.
This is the primary method to be called for each request to be rate-limited.

#### Parameters

##### identifier

`string`

A unique string identifying the client (e.g., IP address).

#### Returns

`Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

A promise that resolves to a `RateLimiterResult`.
