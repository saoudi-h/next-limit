[**next-limit**](../README.md)

***

[next-limit](../README.md) / RedisMultiLike

# Interface: RedisMultiLike

Defined in: [src/types/redis.ts:94](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L94)

Defines an interface for the methods of a Redis `multi` command pipeline.

This interface ensures that the pipeline operations used by the storage are
correctly typed and can be mocked for testing purposes. It represents a
chainable interface for queuing multiple Redis commands to be executed
atomically.

## See

https://redis.io/topics/transactions

## Methods

### exec()

> **exec**(): `Promise`\<`unknown`[]\>

Defined in: [src/types/redis.ts:101](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L101)

#### Returns

`Promise`\<`unknown`[]\>

***

### incr()

> **incr**(`key`): `this`

Defined in: [src/types/redis.ts:95](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L95)

#### Parameters

##### key

`string`

#### Returns

`this`

***

### pExpire()

> **pExpire**(`key`, `milliseconds`): `this`

Defined in: [src/types/redis.ts:96](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L96)

#### Parameters

##### key

`string`

##### milliseconds

`number`

#### Returns

`this`

***

### zAdd()

> **zAdd**(`key`, `member`): `this`

Defined in: [src/types/redis.ts:97](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L97)

#### Parameters

##### key

`string`

##### member

###### score

`number`

###### value

`string`

#### Returns

`this`

***

### zCard()

> **zCard**(`key`): `this`

Defined in: [src/types/redis.ts:99](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L99)

#### Parameters

##### key

`string`

#### Returns

`this`

***

### zRangeWithScores()

> **zRangeWithScores**(`key`, `start`, `stop`): `this`

Defined in: [src/types/redis.ts:100](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L100)

#### Parameters

##### key

`string`

##### start

`number`

##### stop

`number`

#### Returns

`this`

***

### zRemRangeByScore()

> **zRemRangeByScore**(`key`, `min`, `max`): `this`

Defined in: [src/types/redis.ts:98](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/types/redis.ts#L98)

#### Parameters

##### key

`string`

##### min

`number`

##### max

`number`

#### Returns

`this`
