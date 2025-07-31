[**next-limit**](../README.md)

***

[next-limit](../README.md) / RateLimiterInstance

# Interface: RateLimiterInstance

Defined in: [core/rate-limiter.ts:11](https://github.com/saoudi-h/next-limit/blob/0c71c520c8e8fe01ea7d325a61c2d1bef8c2081a/src/core/rate-limiter.ts#L11)

Defines the public interface for a rate limiter instance.
This is what the factory function `createRateLimiter` will return.

## Methods

### consume()

> **consume**(`identifier`): `Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

Defined in: [core/rate-limiter.ts:19](https://github.com/saoudi-h/next-limit/blob/0c71c520c8e8fe01ea7d325a61c2d1bef8c2081a/src/core/rate-limiter.ts#L19)

Consumes a point for a given identifier.
This is the primary method to be called for each request to be rate-limited.

#### Parameters

##### identifier

`string`

A unique string identifying the client (e.g., IP address).

#### Returns

`Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

A promise that resolves to a `RateLimiterResult`.
