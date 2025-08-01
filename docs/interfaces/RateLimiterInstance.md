[**next-limit**](../README.md)

***

[next-limit](../README.md) / RateLimiterInstance

# Interface: RateLimiterInstance

Defined in: [core/rate-limiter.ts:15](https://github.com/saoudi-h/next-limit/blob/58a6c1402186f63b5f3eecaed63a277351987cb7/src/core/rate-limiter.ts#L15)

Defines the public interface for a rate limiter instance.
This is what the factory function `createRateLimiter` will return.

The RateLimiterInstance provides a simple interface for consuming rate limit points
and checking if requests are allowed based on the configured strategy.

## Methods

### consume()

> **consume**(`identifier`): `Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

Defined in: [core/rate-limiter.ts:23](https://github.com/saoudi-h/next-limit/blob/58a6c1402186f63b5f3eecaed63a277351987cb7/src/core/rate-limiter.ts#L23)

Consumes a point for a given identifier.
This is the primary method to be called for each request to be rate-limited.

#### Parameters

##### identifier

`string`

A unique string identifying the client (e.g., IP address).

#### Returns

`Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

A promise that resolves to a `RateLimiterResult`.
