[**next-limit**](../README.md)

***

[next-limit](../README.md) / RateLimiterOptions

# Interface: RateLimiterOptions

Defined in: [core/rate-limiter.ts:11](https://github.com/saoudi-h/next-limit/blob/364f5bf04c9ecd59b43c48876b352d3650948f61/src/core/rate-limiter.ts#L11)

Configuration options for the `RateLimiter`.

## Properties

### limit

> **limit**: `number`

Defined in: [core/rate-limiter.ts:20](https://github.com/saoudi-h/next-limit/blob/364f5bf04c9ecd59b43c48876b352d3650948f61/src/core/rate-limiter.ts#L20)

The maximum number of requests allowed in the window, used for fallback logic.

***

### onError?

> `optional` **onError**: `"allow"` \| `"deny"` \| `"throw"`

Defined in: [core/rate-limiter.ts:27](https://github.com/saoudi-h/next-limit/blob/364f5bf04c9ecd59b43c48876b352d3650948f61/src/core/rate-limiter.ts#L27)

Defines the behavior when an error occurs with the storage adapter.
- `allow`: The request is allowed.
- `deny`: The request is denied (default).
- `throw`: The error is re-thrown.

***

### strategy

> **strategy**: `RateLimitStrategy`

Defined in: [core/rate-limiter.ts:16](https://github.com/saoudi-h/next-limit/blob/364f5bf04c9ecd59b43c48876b352d3650948f61/src/core/rate-limiter.ts#L16)

An instance of a rate limiting strategy.
e.g., `FixedWindowStrategy` or `SlidingWindowStrategy`.
