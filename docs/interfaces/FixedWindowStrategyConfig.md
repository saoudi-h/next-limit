[**next-limit**](../README.md)

***

[next-limit](../README.md) / FixedWindowStrategyConfig

# Interface: FixedWindowStrategyConfig

Defined in: [factories.ts:20](https://github.com/saoudi-h/next-limit/blob/527d4e765919035965098773f4a5584e6ee0095b/src/factories.ts#L20)

Configuration for the Fixed Window strategy.

## Properties

### limit

> **limit**: `number`

Defined in: [factories.ts:24](https://github.com/saoudi-h/next-limit/blob/527d4e765919035965098773f4a5584e6ee0095b/src/factories.ts#L24)

The maximum number of requests allowed within the window.

***

### prefix?

> `optional` **prefix**: `string`

Defined in: [factories.ts:26](https://github.com/saoudi-h/next-limit/blob/527d4e765919035965098773f4a5584e6ee0095b/src/factories.ts#L26)

An optional prefix for storage keys, specific to this strategy instance.

***

### windowMs

> **windowMs**: `number`

Defined in: [factories.ts:22](https://github.com/saoudi-h/next-limit/blob/527d4e765919035965098773f4a5584e6ee0095b/src/factories.ts#L22)

The duration of the time window in milliseconds.
