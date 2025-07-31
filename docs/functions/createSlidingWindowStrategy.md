[**next-limit**](../README.md)

***

[next-limit](../README.md) / createSlidingWindowStrategy

# Function: createSlidingWindowStrategy()

> **createSlidingWindowStrategy**(`config`, `storage`): [`RateLimitStrategy`](../interfaces/RateLimitStrategy.md)

Defined in: [factories.ts:69](https://github.com/saoudi-h/next-limit/blob/0c71c520c8e8fe01ea7d325a61c2d1bef8c2081a/src/factories.ts#L69)

Creates a `SlidingWindowStrategy` instance.

## Parameters

### config

[`SlidingWindowStrategyConfig`](../interfaces/SlidingWindowStrategyConfig.md)

The configuration for the sliding window strategy.

### storage

`Storage`

The storage instance to use.

## Returns

[`RateLimitStrategy`](../interfaces/RateLimitStrategy.md)

A configured instance of `SlidingWindowStrategy`.
