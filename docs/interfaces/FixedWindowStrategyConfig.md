[**next-limit**](../README.md)

***

[next-limit](../README.md) / FixedWindowStrategyConfig

# Interface: FixedWindowStrategyConfig

Defined in: [factories.ts:20](https://github.com/saoudi-h/next-limit/blob/e55bcaec4bc22b5051fbf08bd667233196a14fd8/src/factories.ts#L20)

Configuration for the Fixed Window strategy.

## Properties

### limit

> **limit**: `number`

Defined in: [factories.ts:24](https://github.com/saoudi-h/next-limit/blob/e55bcaec4bc22b5051fbf08bd667233196a14fd8/src/factories.ts#L24)

The maximum number of requests allowed within the window.

***

### prefix?

> `optional` **prefix**: `string`

Defined in: [factories.ts:26](https://github.com/saoudi-h/next-limit/blob/e55bcaec4bc22b5051fbf08bd667233196a14fd8/src/factories.ts#L26)

An optional prefix for storage keys, specific to this strategy instance.

***

### windowMs

> **windowMs**: `number`

Defined in: [factories.ts:22](https://github.com/saoudi-h/next-limit/blob/e55bcaec4bc22b5051fbf08bd667233196a14fd8/src/factories.ts#L22)

The duration of the time window in milliseconds.
