[**next-limit**](../README.md)

***

[next-limit](../README.md) / RateLimitStrategy

# Interface: RateLimitStrategy

Defined in: [core/strategy.ts:22](https://github.com/saoudi-h/next-limit/blob/a021d5ea56d9eb46030653e5f5bb1bd56648180d/src/core/strategy.ts#L22)

Defines the contract for a rate limiting strategy.

## Methods

### limit()

> **limit**(`identifier`, `storage`): `Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

Defined in: [core/strategy.ts:23](https://github.com/saoudi-h/next-limit/blob/a021d5ea56d9eb46030653e5f5bb1bd56648180d/src/core/strategy.ts#L23)

#### Parameters

##### identifier

`string`

##### storage

`Storage`

#### Returns

`Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>
