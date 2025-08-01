[**next-limit**](../README.md)

***

[next-limit](../README.md) / createFixedWindowStrategy

# Function: createFixedWindowStrategy()

> **createFixedWindowStrategy**(`config`): `StrategyFactory`\<[`RateLimitStrategy`](../interfaces/RateLimitStrategy.md)\>

Defined in: [factories.ts:90](https://github.com/saoudi-h/next-limit/blob/58a6c1402186f63b5f3eecaed63a277351987cb7/src/factories.ts#L90)

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

## Examples

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

```typescript
const strategyFactory = createFixedWindowStrategy({
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
