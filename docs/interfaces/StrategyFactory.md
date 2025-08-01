[**next-limit**](../README.md)

***

[next-limit](../README.md) / StrategyFactory

# Interface: StrategyFactory()\<T\>

Defined in: [src/core/strategy.ts:61](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/strategy.ts#L61)

Defines the contract for a strategy factory function.

A StrategyFactory is a higher-order function that creates and configures
rate limiting strategy instances. It encapsulates the creation logic and
dependencies, making it easy to create pre-configured strategies.

## Example

```typescript
// Create a factory for a fixed window strategy
const createFixedWindow = (windowMs: number, limit: number): StrategyFactory<FixedWindowStrategy> => {
  return ({ storage, prefix }) => {
    return new FixedWindowStrategy(storage, prefix, windowMs, limit);
  };
};

// Use the factory
const factory = createFixedWindow(60000, 100); // 100 requests per minute
const strategy = factory({ storage, prefix: 'rate-limit:' });
```

## See

 - createFixedWindowStrategy
 - createSlidingWindowStrategy

## Type Parameters

### T

`T`

The type of strategy to create (e.g., FixedWindowStrategy, SlidingWindowStrategy).

> **StrategyFactory**(`context`): `T`

Defined in: [src/core/strategy.ts:78](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/strategy.ts#L78)

Creates a strategy instance with the provided context.

## Parameters

### context

The context containing storage and prefix.

#### prefix

`string`

The prefix to use for all storage keys to avoid collisions.

#### storage

[`Storage`](Storage.md)

The storage instance to use for persisting rate limit data.

## Returns

`T`

An instance of the strategy.

## Example

```typescript
const strategy = factory({
  storage: new MemoryStorage(),
  prefix: 'myapp:'
});
```
