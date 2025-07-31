[**next-limit**](../README.md)

***

[next-limit](../README.md) / SlidingWindowStrategyConfig

# Interface: SlidingWindowStrategyConfig

Defined in: [factories.ts:32](https://github.com/saoudi-h/next-limit/blob/e4a145e5bc3797945c61eb5f5c739ea59ac60269/src/factories.ts#L32)

Configuration for the Sliding Window strategy.

## Properties

### limit

> **limit**: `number`

Defined in: [factories.ts:36](https://github.com/saoudi-h/next-limit/blob/e4a145e5bc3797945c61eb5f5c739ea59ac60269/src/factories.ts#L36)

The maximum number of requests allowed within the window.

***

### prefix?

> `optional` **prefix**: `string`

Defined in: [factories.ts:38](https://github.com/saoudi-h/next-limit/blob/e4a145e5bc3797945c61eb5f5c739ea59ac60269/src/factories.ts#L38)

An optional prefix for storage keys, specific to this strategy instance.

***

### windowMs

> **windowMs**: `number`

Defined in: [factories.ts:34](https://github.com/saoudi-h/next-limit/blob/e4a145e5bc3797945c61eb5f5c739ea59ac60269/src/factories.ts#L34)

The duration of the time window in milliseconds.
