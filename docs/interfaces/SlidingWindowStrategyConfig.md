[**next-limit**](../README.md)

***

[next-limit](../README.md) / SlidingWindowStrategyConfig

# Interface: SlidingWindowStrategyConfig

Defined in: [factories.ts:39](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L39)

Configuration for the Sliding Window strategy.

This interface defines the configuration options for the sliding window rate limiting strategy.
The sliding window strategy provides a more accurate rate limiting approach by
considering the request rate over a rolling time window.

## Properties

### limit

> **limit**: `number`

Defined in: [factories.ts:43](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L43)

The maximum number of requests allowed within the window.

***

### windowMs

> **windowMs**: `number`

Defined in: [factories.ts:41](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L41)

The duration of the time window in milliseconds.
