[**next-limit**](../README.md)

***

[next-limit](../README.md) / SlidingWindowStrategyConfig

# Interface: SlidingWindowStrategyConfig

Defined in: [factories.ts:41](https://github.com/saoudi-h/next-limit/blob/58a6c1402186f63b5f3eecaed63a277351987cb7/src/factories.ts#L41)

Configuration for the Sliding Window strategy.

This interface defines the configuration options for the sliding window rate limiting strategy.
The sliding window strategy provides a more accurate rate limiting approach by
considering the request rate over a rolling time window.

## Properties

### limit

> **limit**: `number`

Defined in: [factories.ts:45](https://github.com/saoudi-h/next-limit/blob/58a6c1402186f63b5f3eecaed63a277351987cb7/src/factories.ts#L45)

The maximum number of requests allowed within the window.

***

### windowMs

> **windowMs**: `number` \| `StringValue`

Defined in: [factories.ts:43](https://github.com/saoudi-h/next-limit/blob/58a6c1402186f63b5f3eecaed63a277351987cb7/src/factories.ts#L43)

The duration of the time window in milliseconds or a string format (e.g., "1m", "1h").
