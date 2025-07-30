[**next-limit**](../README.md)

***

[next-limit](../README.md) / RateLimiterOptions

# Interface: RateLimiterOptions

Defined in: [core/rate-limiter.ts:18](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/rate-limiter.ts#L18)

Options for creating a `RateLimiter` instance.

## Properties

### limit

> **limit**: `number`

Defined in: [core/rate-limiter.ts:38](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/rate-limiter.ts#L38)

The maximum number of requests allowed within the window.

***

### onError?

> `optional` **onError**: `"allow"` \| `"deny"` \| `"throw"`

Defined in: [core/rate-limiter.ts:53](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/rate-limiter.ts#L53)

Defines the behavior when a rate limit is exceeded.
- 'allow': The request is allowed to proceed.
- 'deny': The request is denied (default).
- 'throw': An error is thrown.

#### Default

```ts
'deny'
```

***

### prefix?

> `optional` **prefix**: `string`

Defined in: [core/rate-limiter.ts:44](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/rate-limiter.ts#L44)

An optional prefix for storage keys to avoid collisions.

#### Default

```ts
'ratelimit'
```

***

### storage

> **storage**: [`StorageAdapter`](StorageAdapter.md)

Defined in: [core/rate-limiter.ts:22](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/rate-limiter.ts#L22)

The storage adapter to use for persisting rate limit data.

***

### strategy

> **strategy**: [`RateLimitStrategy`](RateLimitStrategy.md) \| [`BuiltInStrategyName`](../type-aliases/BuiltInStrategyName.md)

Defined in: [core/rate-limiter.ts:28](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/rate-limiter.ts#L28)

The rate limiting strategy to use.
It can be the name of a built-in strategy or a custom `RateLimitStrategy` instance.

***

### windowMs

> **windowMs**: `number`

Defined in: [core/rate-limiter.ts:33](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/rate-limiter.ts#L33)

The duration of the rate limit window in milliseconds.
