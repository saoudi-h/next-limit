[**next-limit**](../README.md)

***

[next-limit](../README.md) / SlidingWindowStrategy

# Class: SlidingWindowStrategy

Defined in: [strategies/sliding-window.ts:17](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/strategies/sliding-window.ts#L17)

Implements the sliding-window rate limiting algorithm using a Lua script for atomic operations.
This strategy provides a more accurate rate limit by using a rolling time window,
which prevents bursts of traffic at the edges of the window.

It requires a `RedisStorageAdapter` as it depends on the `EVALSHA` command to run the script.

## Implements

- [`RateLimitStrategy`](../interfaces/RateLimitStrategy.md)

## Constructors

### Constructor

> **new SlidingWindowStrategy**(`storage`, `windowMs`, `_limit`, `prefix`): `SlidingWindowStrategy`

Defined in: [strategies/sliding-window.ts:33](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/strategies/sliding-window.ts#L33)

Creates a new instance of the `SlidingWindowStrategy`.

#### Parameters

##### storage

[`StorageAdapter`](../interfaces/StorageAdapter.md)

The storage adapter. Must support Lua scripts (e.g., `RedisStorageAdapter`).

##### windowMs

`number`

The duration of the sliding window in milliseconds.

##### \_limit

`number`

The maximum number of requests allowed within the window.

##### prefix

`string`

A prefix for storage keys to avoid collisions.

#### Returns

`SlidingWindowStrategy`

## Methods

### limit()

> **limit**(`identifier`): `Promise`\<[`RateLimiterResult`](../interfaces/RateLimiterResult.md)\>

Defined in: [strategies/sliding-window.ts:63](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/strategies/sliding-window.ts#L63)

Applies the sliding-window rate limiting logic by executing the Lua script.

#### Parameters

##### identifier

`string`

The unique identifier for the client.

#### Returns

`Promise`\<[`RateLimiterResult`](../interfaces/RateLimiterResult.md)\>

A promise that resolves to a `RateLimiterResult` object returned by the script.

#### Implementation of

[`RateLimitStrategy`](../interfaces/RateLimitStrategy.md).[`limit`](../interfaces/RateLimitStrategy.md#limit)
