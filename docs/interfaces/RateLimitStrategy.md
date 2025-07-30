[**next-limit**](../README.md)

***

[next-limit](../README.md) / RateLimitStrategy

# Interface: RateLimitStrategy

Defined in: [core/strategy.ts:34](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/strategy.ts#L34)

Defines the contract for a rate limiting strategy.
A strategy encapsulates a specific algorithm (e.g., fixed-window, sliding-window)
for deciding whether to allow or deny a request based on its identifier.

## Methods

### limit()

> **limit**(`identifier`): `Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

Defined in: [core/strategy.ts:41](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/strategy.ts#L41)

Applies the rate limiting logic for a given identifier.

#### Parameters

##### identifier

`string`

A unique string identifying the client making the request (e.g., an IP address or user ID).

#### Returns

`Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

A promise that resolves to a `RateLimiterResult` object containing the outcome of the check.
