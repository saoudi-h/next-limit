[**next-limit**](../README.md)

***

[next-limit](../README.md) / RateLimiterResult

# Interface: RateLimiterResult

Defined in: [core/strategy.ts:12](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/strategy.ts#L12)

Represents the result of a rate limit check.
This object provides information about whether the request was allowed,
how many requests are remaining, and when the limit will reset.

## Properties

### allowed

> **allowed**: `boolean`

Defined in: [core/strategy.ts:17](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/strategy.ts#L17)

A boolean indicating whether the request is permitted.
`true` if the request is within the limit, `false` otherwise.

***

### remaining

> **remaining**: `number`

Defined in: [core/strategy.ts:21](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/strategy.ts#L21)

The number of requests left that can be made in the current time window.

***

### reset

> **reset**: `number`

Defined in: [core/strategy.ts:26](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/strategy.ts#L26)

The timestamp (in milliseconds since the Unix epoch) when the rate limit window will reset.
A client can use this to know when to retry a request.
