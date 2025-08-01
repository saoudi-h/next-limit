[**next-limit**](../README.md)

***

[next-limit](../README.md) / FixedWindowStrategyConfig

# Interface: FixedWindowStrategyConfig

Defined in: [factories.ts:27](https://github.com/saoudi-h/next-limit/blob/58a6c1402186f63b5f3eecaed63a277351987cb7/src/factories.ts#L27)

Configuration for the Fixed Window strategy.

This interface defines the configuration options for the fixed window rate limiting strategy.
The fixed window strategy divides time into fixed intervals (windows) and allows
a maximum number of requests within each window.

## Properties

### limit

> **limit**: `number`

Defined in: [factories.ts:31](https://github.com/saoudi-h/next-limit/blob/58a6c1402186f63b5f3eecaed63a277351987cb7/src/factories.ts#L31)

The maximum number of requests allowed within the window.

***

### windowMs

> **windowMs**: `number` \| `StringValue`

Defined in: [factories.ts:29](https://github.com/saoudi-h/next-limit/blob/58a6c1402186f63b5f3eecaed63a277351987cb7/src/factories.ts#L29)

The duration of the time window in milliseconds or a string format (e.g., "1m", "1h").
