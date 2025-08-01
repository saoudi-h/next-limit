[**next-limit**](../README.md)

***

[next-limit](../README.md) / createSlidingWindowStrategy

# Function: createSlidingWindowStrategy()

> **createSlidingWindowStrategy**(`options`): [`StrategyFactory`](../interfaces/StrategyFactory.md)\<[`SlidingWindowStrategy`](../interfaces/SlidingWindowStrategy.md)\>

Defined in: [src/factories.ts:172](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L172)

Creates a factory function for sliding window rate limiting strategies.

This strategy provides more accurate rate limiting by considering a rolling
time window. It uses Redis sorted sets to track request timestamps and
allows a maximum number of requests within any window of the specified duration.

## Parameters

### options

[`WindowOptions`](../interfaces/WindowOptions.md)

Configuration options for the sliding window strategy

## Returns

[`StrategyFactory`](../interfaces/StrategyFactory.md)\<[`SlidingWindowStrategy`](../interfaces/SlidingWindowStrategy.md)\>

A factory function that creates SlidingWindowStrategy instances

## Example

```typescript
const createStrategy = createSlidingWindowStrategy({
  windowMs: 60000, // 1 minute window
  limit: 100       // Max 100 requests per window
});

// Later, with storage and prefix
const strategy = createStrategy({ storage, prefix: 'rate-limit:' });
```
