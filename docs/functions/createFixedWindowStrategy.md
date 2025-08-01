[**next-limit**](../README.md)

***

[next-limit](../README.md) / createFixedWindowStrategy

# Function: createFixedWindowStrategy()

> **createFixedWindowStrategy**(`config`): `StrategyFactory`\<[`RateLimitStrategy`](../interfaces/RateLimitStrategy.md)\>

Defined in: [factories.ts:72](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L72)

Creates a factory function for a `FixedWindowStrategy` instance.

This function returns a factory that, when executed with a context containing
storage and prefix, creates a new `FixedWindowStrategy` instance.

## Parameters

### config

[`FixedWindowStrategyConfig`](../interfaces/FixedWindowStrategyConfig.md)

The configuration for the fixed window strategy.

## Returns

`StrategyFactory`\<[`RateLimitStrategy`](../interfaces/RateLimitStrategy.md)\>

A factory function that creates a `FixedWindowStrategy` instance.

## Example

```typescript
const strategyFactory = createFixedWindowStrategy({
  windowMs: 60000, // 1 minute
  limit: 100,      // 100 requests per minute
});

const strategy = strategyFactory({
  storage: createMemoryStorage(),
  prefix: 'my-app'
});
```
