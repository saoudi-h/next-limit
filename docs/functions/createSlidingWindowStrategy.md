[**next-limit**](../README.md)

***

[next-limit](../README.md) / createSlidingWindowStrategy

# Function: createSlidingWindowStrategy()

> **createSlidingWindowStrategy**(`config`): `StrategyFactory`\<[`RateLimitStrategy`](../interfaces/RateLimitStrategy.md)\>

Defined in: [factories.ts:109](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L109)

Creates a factory function for a `SlidingWindowStrategy` instance.

This function returns a factory that, when executed with a context containing
storage and prefix, creates a new `SlidingWindowStrategy` instance.

## Parameters

### config

[`SlidingWindowStrategyConfig`](../interfaces/SlidingWindowStrategyConfig.md)

The configuration for the sliding window strategy.

## Returns

`StrategyFactory`\<[`RateLimitStrategy`](../interfaces/RateLimitStrategy.md)\>

A factory function that creates a `SlidingWindowStrategy` instance.

## Example

```typescript
const strategyFactory = createSlidingWindowStrategy({
  windowMs: 60000, // 1 minute
  limit: 100,      // 100 requests per minute
});

const strategy = strategyFactory({
  storage: createMemoryStorage(),
  prefix: 'my-app'
});
```
