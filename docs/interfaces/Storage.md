[**next-limit**](../README.md)

***

[next-limit](../README.md) / Storage

# Interface: Storage

Defined in: [src/core/storage.ts:74](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L74)

Defines the contract for storage implementations used by the rate limiter.

This interface abstracts the storage layer, allowing different storage backends
(in-memory, Redis, etc.) to be used interchangeably. It provides methods for
basic key-value operations with TTL support, as well as sorted set operations
used by certain rate limiting strategies.

## Methods

### delete()

> **delete**(`key`): `Promise`\<`void`\>

Defined in: [src/core/storage.ts:77](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L77)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

***

### exists()

> **exists**(`key`): `Promise`\<`boolean`\>

Defined in: [src/core/storage.ts:78](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L78)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`boolean`\>

***

### expire()

> **expire**(`key`, `ttlMs`): `Promise`\<`void`\>

Defined in: [src/core/storage.ts:89](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L89)

#### Parameters

##### key

`string`

##### ttlMs

`number`

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**(`key`): `Promise`\<`null` \| `string`\>

Defined in: [src/core/storage.ts:75](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L75)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`null` \| `string`\>

***

### increment()

> **increment**(`key`, `ttlMs?`): `Promise`\<`number`\>

Defined in: [src/core/storage.ts:79](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L79)

#### Parameters

##### key

`string`

##### ttlMs?

`number`

#### Returns

`Promise`\<`number`\>

***

### pipeline()

> **pipeline**(): [`StoragePipeline`](StoragePipeline.md)

Defined in: [src/core/storage.ts:88](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L88)

#### Returns

[`StoragePipeline`](StoragePipeline.md)

***

### set()

> **set**(`key`, `value`, `ttlMs?`): `Promise`\<`void`\>

Defined in: [src/core/storage.ts:76](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L76)

#### Parameters

##### key

`string`

##### value

`string`

##### ttlMs?

`number`

#### Returns

`Promise`\<`void`\>

***

### zAdd()

> **zAdd**(`key`, `score`, `member`): `Promise`\<`void`\>

Defined in: [src/core/storage.ts:80](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L80)

#### Parameters

##### key

`string`

##### score

`number`

##### member

`string`

#### Returns

`Promise`\<`void`\>

***

### zCount()

> **zCount**(`key`): `Promise`\<`number`\>

Defined in: [src/core/storage.ts:82](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L82)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`number`\>

***

### zRangeWithScores()

> **zRangeWithScores**(`key`, `start`, `stop`): `Promise`\<`object`[]\>

Defined in: [src/core/storage.ts:83](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L83)

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

### zRemoveRangeByScore()

> **zRemoveRangeByScore**(`key`, `min`, `max`): `Promise`\<`number`\>

Defined in: [src/core/storage.ts:81](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L81)

#### Parameters

##### key

`string`

##### min

`number`

##### max

`number`

#### Returns

`Promise`\<`number`\>
