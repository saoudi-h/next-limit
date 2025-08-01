[**next-limit**](../README.md)

***

[next-limit](../README.md) / FixedWindowStrategyConfig

# Interface: FixedWindowStrategyConfig

Defined in: [factories.ts:25](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L25)

Configuration for the Fixed Window strategy.

This interface defines the configuration options for the fixed window rate limiting strategy.
The fixed window strategy divides time into fixed intervals (windows) and allows
a maximum number of requests within each window.

## Properties

### limit

> **limit**: `number`

Defined in: [factories.ts:29](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L29)

The maximum number of requests allowed within the window.

***

### windowMs

> **windowMs**: `number`

Defined in: [factories.ts:27](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L27)

The duration of the time window in milliseconds.
