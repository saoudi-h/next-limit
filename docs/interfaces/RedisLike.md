[**next-limit**](../README.md)

***

[next-limit](../README.md) / RedisLike

# Interface: RedisLike

Defined in: [src/types/redis.ts:45](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L45)

Defines an interface for the Redis methods used by the package.

This abstraction allows for easier mocking in tests and supports using
different Redis client implementations that adhere to this contract. It includes
only the Redis commands required by the rate limiter's storage implementation.

Implement this interface to create custom Redis client adapters for different
Redis libraries or services.

## Example

```typescript
class MyCustomRedisClient implements RedisLike {
  async get(key: string): Promise<string | null> {
    // Implementation for GET command
  }
  // ... other required methods
}
```

## Properties

### isReady?

> `optional` **isReady**: `boolean`

Defined in: [src/types/redis.ts:80](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L80)

## Methods

### connect()?

> `optional` **connect**(): `Promise`\<`void`\>

Defined in: [src/types/redis.ts:81](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L81)

#### Returns

`Promise`\<`void`\>

***

### del()

> **del**(`key`): `Promise`\<`number`\>

Defined in: [src/types/redis.ts:59](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L59)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`number`\>

***

### eval()

> **eval**(`script`, `options`): `Promise`\<`unknown`\>

Defined in: [src/types/redis.ts:76](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L76)

#### Parameters

##### script

`string`

##### options

###### arguments

`string`[]

###### keys

`string`[]

#### Returns

`Promise`\<`unknown`\>

***

### exists()

> **exists**(`key`): `Promise`\<`number`\>

Defined in: [src/types/redis.ts:60](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L60)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`number`\>

***

### get()

> **get**(`key`): `Promise`\<`null` \| `string`\>

Defined in: [src/types/redis.ts:46](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L46)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`null` \| `string`\>

***

### incr()

> **incr**(`key`): `Promise`\<`number`\>

Defined in: [src/types/redis.ts:61](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L61)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`number`\>

***

### multi()

> **multi**(): [`RedisMultiLike`](RedisMultiLike.md)

Defined in: [src/types/redis.ts:75](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L75)

#### Returns

[`RedisMultiLike`](RedisMultiLike.md)

***

### pExpire()

> **pExpire**(`key`, `milliseconds`): `Promise`\<`boolean`\>

Defined in: [src/types/redis.ts:62](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L62)

#### Parameters

##### key

`string`

##### milliseconds

`number`

#### Returns

`Promise`\<`boolean`\>

***

### set()

> **set**(`key`, `value`, `options?`): `Promise`\<`null` \| `string`\>

Defined in: [src/types/redis.ts:47](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L47)

#### Parameters

##### key

`string`

##### value

`string`

##### options?

###### EX?

`number`

###### KEEPTTL?

`boolean`

###### NX?

`boolean`

###### PX?

`number`

###### XX?

`boolean`

#### Returns

`Promise`\<`null` \| `string`\>

***

### setEx()

> **setEx**(`key`, `seconds`, `value`): `Promise`\<`null` \| `string`\>

Defined in: [src/types/redis.ts:58](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L58)

#### Parameters

##### key

`string`

##### seconds

`number`

##### value

`string`

#### Returns

`Promise`\<`null` \| `string`\>

***

### zAdd()

#### Call Signature

> **zAdd**(`key`, `members`): `Promise`\<`number`\>

Defined in: [src/types/redis.ts:63](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L63)

##### Parameters

###### key

`string`

###### members

`object`[]

##### Returns

`Promise`\<`number`\>

#### Call Signature

> **zAdd**(`key`, `member`): `Promise`\<`number`\>

Defined in: [src/types/redis.ts:67](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L67)

##### Parameters

###### key

`string`

###### member

###### score

`number`

###### value

`string`

##### Returns

`Promise`\<`number`\>

***

### zCard()

> **zCard**(`key`): `Promise`\<`number`\>

Defined in: [src/types/redis.ts:69](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L69)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`number`\>

***

### zRangeWithScores()

> **zRangeWithScores**(`key`, `start`, `stop`): `Promise`\<`object`[]\>

Defined in: [src/types/redis.ts:70](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L70)

#### Parameters

##### key

`string`

##### start

`number`

##### stop

`number`

#### Returns

`Promise`\<`object`[]\>

***

### zRemRangeByScore()

> **zRemRangeByScore**(`key`, `min`, `max`): `Promise`\<`number`\>

Defined in: [src/types/redis.ts:68](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L68)

#### Parameters

##### key

`string`

##### min

`number`

##### max

`number`

#### Returns

`Promise`\<`number`\>
