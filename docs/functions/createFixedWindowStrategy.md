[**next-limit**](../README.md)

***

[next-limit](../README.md) / createFixedWindowStrategy

# Function: createFixedWindowStrategy()

> **createFixedWindowStrategy**(`options`): [`StrategyFactory`](../interfaces/StrategyFactory.md)\<[`FixedWindowStrategy`](../interfaces/FixedWindowStrategy.md)\>

Defined in: [src/factories.ts:123](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L123)

Creates a factory function for fixed window rate limiting strategies.

This strategy is simple and efficient, with constant time complexity O(1) for
both memory and computation. It divides time into fixed intervals (windows)
and allows a maximum number of requests within each window.

## Parameters

### options

[`WindowOptions`](../interfaces/WindowOptions.md)

Configuration options for the fixed window strategy

## Returns

[`StrategyFactory`](../interfaces/StrategyFactory.md)\<[`FixedWindowStrategy`](../interfaces/FixedWindowStrategy.md)\>

A factory function that creates FixedWindowStrategy instances

## Example

```typescript
const createStrategy = createFixedWindowStrategy({
  windowMs: 60000, // 1 minute window
  limit: 100       // Max 100 requests per window
});

// Later, with storage and prefix
const strategy = createStrategy({ storage, prefix: 'rate-limit:' });
```
