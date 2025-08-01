[**next-limit**](../README.md)

***

[next-limit](../README.md) / RateLimitStrategy

# Interface: RateLimitStrategy

Defined in: [src/core/strategy.ts:25](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/strategy.ts#L25)

Defines the contract for a rate limiting strategy.

This interface represents the core contract that all rate limiting strategies must implement.
Each strategy defines how to handle rate limiting for a specific algorithm (e.g., fixed window, sliding window).

## Methods

### limit()

> **limit**(`identifier`): `Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

Defined in: [src/core/strategy.ts:32](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/strategy.ts#L32)

Checks if a request is allowed based on the rate limiting rules.

#### Parameters

##### identifier

`string`

A unique string identifying the client (e.g., IP address).

#### Returns

`Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

A promise that resolves to a `RateLimiterResult` indicating whether the request is allowed.
