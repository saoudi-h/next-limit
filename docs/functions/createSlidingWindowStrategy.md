[**next-limit**](../README.md)

***

[next-limit](../README.md) / createSlidingWindowStrategy

# Function: createSlidingWindowStrategy()

> **createSlidingWindowStrategy**(`config`): `StrategyFactory`\<[`RateLimitStrategy`](../interfaces/RateLimitStrategy.md)\>

Defined in: [factories.ts:155](https://github.com/saoudi-h/next-limit/blob/58a6c1402186f63b5f3eecaed63a277351987cb7/src/factories.ts#L155)

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

## Examples

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

```typescript
const strategyFactory = createSlidingWindowStrategy({
  windowMs: "1m", // 1 minute
  limit: 100,     // 100 requests per minute
});

const strategy = strategyFactory({
  storage: createMemoryStorage(),
  prefix: 'my-app'
});
```

## Throws

Will throw an error if `windowMs` is not a valid positive number or a StringValue from `ms` (e.g., "1m", "1h").

## See

https://github.com/vercel/ms for more information on string format.
