[**next-limit**](../README.md)

***

[next-limit](../README.md) / CreateRateLimiterOptions

# Interface: CreateRateLimiterOptions

Defined in: [factories.ts:80](https://github.com/saoudi-h/next-limit/blob/a021d5ea56d9eb46030653e5f5bb1bd56648180d/src/factories.ts#L80)

Options for creating a rate limiter with the `createRateLimiter` factory.

## Properties

### onError?

> `optional` **onError**: `"allow"` \| `"deny"` \| `"throw"`

Defined in: [factories.ts:100](https://github.com/saoudi-h/next-limit/blob/a021d5ea56d9eb46030653e5f5bb1bd56648180d/src/factories.ts#L100)

Defines the behavior when a storage error occurs.
- 'allow': The request is allowed to proceed.
- 'deny': The request is denied (default).
- 'throw': The underlying storage error is thrown.

#### Default

```ts
'deny'
```

***

### storage

> **storage**: `Storage`

Defined in: [factories.ts:91](https://github.com/saoudi-h/next-limit/blob/a021d5ea56d9eb46030653e5f5bb1bd56648180d/src/factories.ts#L91)

The storage instance to use.
Create this using a storage factory like `createMemoryStorage`.

***

### strategy

> **strategy**: [`RateLimitStrategy`](RateLimitStrategy.md)

Defined in: [factories.ts:85](https://github.com/saoudi-h/next-limit/blob/a021d5ea56d9eb46030653e5f5bb1bd56648180d/src/factories.ts#L85)

The rate limiting strategy instance to use.
Create this using a strategy factory like `createFixedWindowStrategy`.
