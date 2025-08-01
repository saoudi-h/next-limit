[**next-limit**](../README.md)

***

[next-limit](../README.md) / RedisStorage

# Interface: RedisStorage

Defined in: [src/core/storage.ts:128](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L128)

A Redis-based implementation of the `Storage` interface.

This class provides a Redis-backed storage solution for rate limiting,
making it suitable for distributed applications that need to share rate limit
state across multiple processes or servers.

## Example

```typescript
// Create with a Redis client instance
const redisClient = createClient();
await redisClient.connect();
const storage = new RedisStorage(redisClient);

// Or with options
const storageWithOptions = new RedisStorage({
  redis: redisClient,
  keyPrefix: 'myapp',
  autoConnect: true,
  timeout: 5000
});
```

## Implements

- [`Storage`](Storage.md)

## Properties

### redis

> **redis**: [`RedisLike`](RedisLike.md)

Defined in: [src/core/storage.ts:129](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L129)

## Methods

### delete()

> **delete**(`key`): `Promise`\<`void`\>

Defined in: [src/core/storage.ts:252](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L252)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Storage.delete`

***

### ensureReady()

> **ensureReady**(): `Promise`\<`void`\>

Defined in: [src/core/storage.ts:164](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L164)

#### Returns

`Promise`\<`void`\>

***

### exists()

> **exists**(`key`): `Promise`\<`boolean`\>

Defined in: [src/core/storage.ts:257](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L257)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`Storage.exists`

***

### expire()

> **expire**(`key`, `ttlMs`): `Promise`\<`void`\>

Defined in: [src/core/storage.ts:318](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L318)

#### Parameters

##### key

`string`

##### ttlMs

`number`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Storage.expire`

***

### get()

> **get**(`key`): `Promise`\<`null` \| `string`\>

Defined in: [src/core/storage.ts:234](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L234)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`null` \| `string`\>

#### Implementation of

`Storage.get`

***

### increment()

> **increment**(`key`, `ttlMs?`): `Promise`\<`number`\>

Defined in: [src/core/storage.ts:265](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L265)

#### Parameters

##### key

`string`

##### ttlMs?

`number`

#### Returns

`Promise`\<`number`\>

#### Implementation of

`Storage.increment`

***

### pipeline()

> **pipeline**(): [`StoragePipeline`](StoragePipeline.md)

Defined in: [src/core/storage.ts:314](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L314)

#### Returns

[`StoragePipeline`](StoragePipeline.md)

#### Implementation of

`Storage.pipeline`

***

### set()

> **set**(`key`, `value`, `ttlMs?`): `Promise`\<`void`\>

Defined in: [src/core/storage.ts:239](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L239)

#### Parameters

##### key

`string`

##### value

`string`

##### ttlMs?

`number`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Storage.set`

***

### zAdd()

> **zAdd**(`key`, `score`, `member`): `Promise`\<`void`\>

Defined in: [src/core/storage.ts:279](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L279)

#### Parameters

##### key

`string`

##### score

`number`

##### member

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Storage.zAdd`

***

### zCount()

> **zCount**(`key`): `Promise`\<`number`\>

Defined in: [src/core/storage.ts:297](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L297)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`number`\>

#### Implementation of

`Storage.zCount`

***

### zRangeWithScores()

> **zRangeWithScores**(`key`, `start`, `stop`): `Promise`\<`object`[]\>

Defined in: [src/core/storage.ts:302](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L302)

#### Parameters

##### key

`string`

##### start

`number`

##### stop

`number`

#### Returns

`Promise`\<`object`[]\>

#### Implementation of

`Storage.zRangeWithScores`

***

### zRemoveRangeByScore()

> **zRemoveRangeByScore**(`key`, `min`, `max`): `Promise`\<`number`\>

Defined in: [src/core/storage.ts:286](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L286)

#### Parameters

##### key

`string`

##### min

`number`

##### max

`number`

#### Returns

`Promise`\<`number`\>

#### Implementation of

`Storage.zRemoveRangeByScore`
