[**next-limit**](../README.md)

***

[next-limit](../README.md) / RateLimiter

# Class: RateLimiter

Defined in: [core/rate-limiter.ts:60](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/rate-limiter.ts#L60)

A flexible and extensible rate limiter for Node.js applications.
It supports various strategies and can be adapted to different storage backends.

## Constructors

### Constructor

> **new RateLimiter**(`options`): `RateLimiter`

Defined in: [core/rate-limiter.ts:70](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/rate-limiter.ts#L70)

Creates a new `RateLimiter` instance.

#### Parameters

##### options

[`RateLimiterOptions`](../interfaces/RateLimiterOptions.md)

The options for the rate limiter.

#### Returns

`RateLimiter`

## Methods

### hit()

> **hit**(`identifier`): `Promise`\<[`RateLimiterResult`](../interfaces/RateLimiterResult.md)\>

Defined in: [core/rate-limiter.ts:140](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/rate-limiter.ts#L140)

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

Defined in: [core/rate-limiter.ts:153](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/rate-limiter.ts#L153)

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
