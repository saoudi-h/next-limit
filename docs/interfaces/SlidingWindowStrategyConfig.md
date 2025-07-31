[**next-limit**](../README.md)

***

[next-limit](../README.md) / SlidingWindowStrategyConfig

# Interface: SlidingWindowStrategyConfig

Defined in: [factories.ts:32](https://github.com/saoudi-h/next-limit/blob/0c71c520c8e8fe01ea7d325a61c2d1bef8c2081a/src/factories.ts#L32)

Configuration for the Sliding Window strategy.

## Properties

### limit

> **limit**: `number`

Defined in: [factories.ts:36](https://github.com/saoudi-h/next-limit/blob/0c71c520c8e8fe01ea7d325a61c2d1bef8c2081a/src/factories.ts#L36)

The maximum number of requests allowed within the window.

***

### prefix?

> `optional` **prefix**: `string`

Defined in: [factories.ts:38](https://github.com/saoudi-h/next-limit/blob/0c71c520c8e8fe01ea7d325a61c2d1bef8c2081a/src/factories.ts#L38)

An optional prefix for storage keys, specific to this strategy instance.

***

### windowMs

> **windowMs**: `number`

Defined in: [factories.ts:34](https://github.com/saoudi-h/next-limit/blob/0c71c520c8e8fe01ea7d325a61c2d1bef8c2081a/src/factories.ts#L34)

The duration of the time window in milliseconds.
