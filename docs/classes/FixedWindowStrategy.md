[**next-limit**](../README.md)

***

[next-limit](../README.md) / FixedWindowStrategy

# Class: FixedWindowStrategy

Defined in: [strategies/fixed-window.ts:14](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/strategies/fixed-window.ts#L14)

Implements the fixed-window rate limiting algorithm.
This strategy counts requests within a fixed time window (e.g., 100 requests per hour).
It is simple and efficient, making it a good choice for many use cases.
However, it can allow a burst of traffic to exceed the limit near the window's edge.

## Implements

- [`RateLimitStrategy`](../interfaces/RateLimitStrategy.md)

## Constructors

### Constructor

> **new FixedWindowStrategy**(`storage`, `windowMs`, `_limit`, `prefix`): `FixedWindowStrategy`

Defined in: [strategies/fixed-window.ts:23](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/strategies/fixed-window.ts#L23)

Creates a new instance of the `FixedWindowStrategy`.

#### Parameters

##### storage

[`StorageAdapter`](../interfaces/StorageAdapter.md)

The storage adapter used to store hit counts.

##### windowMs

`number`

The duration of the time window in milliseconds.

##### \_limit

`number`

The maximum number of requests allowed within the window.

##### prefix

`string`

A prefix for storage keys to avoid collisions.

#### Returns

`FixedWindowStrategy`

## Methods

### limit()

> **limit**(`identifier`): `Promise`\<[`RateLimiterResult`](../interfaces/RateLimiterResult.md)\>

Defined in: [strategies/fixed-window.ts:37](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/strategies/fixed-window.ts#L37)

Applies the fixed-window rate limiting logic.
It increments a counter for the given identifier and checks if it exceeds the limit.

#### Parameters

##### identifier

`string`

The unique identifier for the client.

#### Returns

`Promise`\<[`RateLimiterResult`](../interfaces/RateLimiterResult.md)\>

A promise that resolves to a `RateLimiterResult` object.

#### Implementation of

[`RateLimitStrategy`](../interfaces/RateLimitStrategy.md).[`limit`](../interfaces/RateLimitStrategy.md#limit)
