[**next-limit**](../README.md)

***

[next-limit](../README.md) / RateLimitStrategy

# Interface: RateLimitStrategy

Defined in: [core/strategy.ts:22](https://github.com/saoudi-h/next-limit/blob/0c71c520c8e8fe01ea7d325a61c2d1bef8c2081a/src/core/strategy.ts#L22)

Defines the contract for a rate limiting strategy.

## Methods

### limit()

> **limit**(`identifier`): `Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>

Defined in: [core/strategy.ts:23](https://github.com/saoudi-h/next-limit/blob/0c71c520c8e8fe01ea7d325a61c2d1bef8c2081a/src/core/strategy.ts#L23)

#### Parameters

##### identifier

`string`

#### Returns

`Promise`\<[`RateLimiterResult`](RateLimiterResult.md)\>
