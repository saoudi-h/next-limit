[**next-limit**](../README.md)

***

[next-limit](../README.md) / CreateRateLimiterOptions

# Interface: CreateRateLimiterOptions

Defined in: [factories.ts:130](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L130)

Options for creating a rate limiter with the `createRateLimiter` factory.

This interface defines the configuration options for creating a rate limiter instance.
It includes the strategy factory, storage instance, optional prefix, and error handling policy.

## Properties

### onError?

> `optional` **onError**: `"allow"` \| `"deny"` \| `"throw"`

Defined in: [factories.ts:157](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L157)

Defines the behavior when a storage error occurs.
- 'allow': The request is allowed to proceed.
- 'deny': The request is denied (default).
- 'throw': The underlying storage error is thrown.

#### Default

```ts
'deny'
```

***

### prefix?

> `optional` **prefix**: `string`

Defined in: [factories.ts:148](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L148)

An optional prefix for storage keys.
If provided, it will be used as the prefix for all storage keys.
If not provided, a unique prefix will be automatically generated.

***

### storage

> **storage**: `Storage`

Defined in: [factories.ts:141](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L141)

The storage instance to use.
Create this using a storage factory like `createMemoryStorage`.

***

### strategy

> **strategy**: `StrategyFactory`\<[`RateLimitStrategy`](RateLimitStrategy.md)\>

Defined in: [factories.ts:135](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L135)

The rate limiting strategy factory to use.
Create this using a strategy factory like `createFixedWindowStrategy`.
