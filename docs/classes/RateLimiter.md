[**next-limit**](../README.md)

***

[next-limit](../README.md) / RateLimiter

# Class: RateLimiter

Defined in: [core/rate-limiter.ts:34](https://github.com/saoudi-h/next-limit/blob/364f5bf04c9ecd59b43c48876b352d3650948f61/src/core/rate-limiter.ts#L34)

The main class for rate limiting.
It orchestrates the selected strategy and storage adapter to perform rate limiting checks.

## Constructors

### Constructor

> **new RateLimiter**(`options`): `RateLimiter`

Defined in: [core/rate-limiter.ts:43](https://github.com/saoudi-h/next-limit/blob/364f5bf04c9ecd59b43c48876b352d3650948f61/src/core/rate-limiter.ts#L43)

Creates a new `RateLimiter` instance.

#### Parameters

##### options

[`RateLimiterOptions`](../interfaces/RateLimiterOptions.md)

The configuration options for the rate limiter.

#### Returns

`RateLimiter`

## Methods

### hit()

> **hit**(`identifier`): `Promise`\<[`RateLimiterResult`](../interfaces/RateLimiterResult.md)\>

Defined in: [core/rate-limiter.ts:86](https://github.com/saoudi-h/next-limit/blob/364f5bf04c9ecd59b43c48876b352d3650948f61/src/core/rate-limiter.ts#L86)

Checks and registers a hit for a given identifier.
This is the primary method to be called for each request.

#### Parameters

##### identifier

`string`

A unique string identifying the client (e.g., IP address).

#### Returns

`Promise`\<[`RateLimiterResult`](../interfaces/RateLimiterResult.md)\>

A promise that resolves to a `RateLimiterResult`.

***

### isAllowed()

> **isAllowed**(`identifier`): `Promise`\<[`RateLimiterResult`](../interfaces/RateLimiterResult.md)\>

Defined in: [core/rate-limiter.ts:99](https://github.com/saoudi-h/next-limit/blob/364f5bf04c9ecd59b43c48876b352d3650948f61/src/core/rate-limiter.ts#L99)

An alias for the `hit` method.

#### Parameters

##### identifier

`string`

A unique string identifying the client (e.g., IP address).

#### Returns

`Promise`\<[`RateLimiterResult`](../interfaces/RateLimiterResult.md)\>

A promise that resolves to a `RateLimiterResult`.

#### See

hit
