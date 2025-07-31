[**next-limit**](../README.md)

***

[next-limit](../README.md) / RateLimitStrategy

# Interface: RateLimitStrategy

Defined in: [core/strategy.ts:22](https://github.com/saoudi-h/next-limit/blob/527d4e765919035965098773f4a5584e6ee0095b/src/core/strategy.ts#L22)

Defines the contract for a rate limiting strategy.

## Methods

### limit()

> **limit**(`identifier`, `storage`): `Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

Defined in: [core/strategy.ts:23](https://github.com/saoudi-h/next-limit/blob/527d4e765919035965098773f4a5584e6ee0095b/src/core/strategy.ts#L23)

#### Parameters

##### identifier

`string`

##### storage

`Storage`

#### Returns

`Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>
