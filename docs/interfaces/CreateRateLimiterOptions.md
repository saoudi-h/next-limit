[**next-limit**](../README.md)

***

[next-limit](../README.md) / CreateRateLimiterOptions

# Interface: CreateRateLimiterOptions

Defined in: [factories.ts:86](https://github.com/saoudi-h/next-limit/blob/0c71c520c8e8fe01ea7d325a61c2d1bef8c2081a/src/factories.ts#L86)

Options for creating a rate limiter with the `createRateLimiter` factory.

## Properties

### onError?

> `optional` **onError**: `"allow"` \| `"deny"` \| `"throw"`

Defined in: [factories.ts:100](https://github.com/saoudi-h/next-limit/blob/0c71c520c8e8fe01ea7d325a61c2d1bef8c2081a/src/factories.ts#L100)

Defines the behavior when a storage error occurs.
- 'allow': The request is allowed to proceed.
- 'deny': The request is denied (default).
- 'throw': The underlying storage error is thrown.

#### Default

```ts
'deny'
```

***

### strategy

> **strategy**: [`RateLimitStrategy`](RateLimitStrategy.md)

Defined in: [factories.ts:91](https://github.com/saoudi-h/next-limit/blob/0c71c520c8e8fe01ea7d325a61c2d1bef8c2081a/src/factories.ts#L91)

The rate limiting strategy instance to use.
Create this using a strategy factory like `createFixedWindowStrategy`.
