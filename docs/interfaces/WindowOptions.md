[**next-limit**](../README.md)

***

[next-limit](../README.md) / WindowOptions

# Interface: WindowOptions

Defined in: [src/factories.ts:28](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L28)

Common options for all window-based strategies.

## Properties

### limit

> **limit**: `number`

Defined in: [src/factories.ts:38](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L38)

The maximum number of requests allowed in the time window.

***

### windowMs

> **windowMs**: `number` \| `StringValue`

Defined in: [src/factories.ts:33](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L33)

The duration of the time window in milliseconds or as a string.

#### Example

```ts
60000, '1m', '1h'
```
