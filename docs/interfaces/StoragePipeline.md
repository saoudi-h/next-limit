[**next-limit**](../README.md)

***

[next-limit](../README.md) / StoragePipeline

# Interface: StoragePipeline

Defined in: [src/core/storage.ts:95](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L95)

An interface for storage pipeline implementations.

## Methods

### exec()

> **exec**(): `Promise`\<`unknown`[]\>

Defined in: [src/core/storage.ts:102](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L102)

#### Returns

`Promise`\<`unknown`[]\>

***

### expire()

> **expire**(`key`, `ttlMs`): `Promise`\<`StoragePipeline`\>

Defined in: [src/core/storage.ts:101](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L101)

#### Parameters

##### key

`string`

##### ttlMs

`number`

#### Returns

`Promise`\<`StoragePipeline`\>

***

### increment()

> **increment**(`key`, `ttlMs?`): `Promise`\<`StoragePipeline`\>

Defined in: [src/core/storage.ts:96](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L96)

#### Parameters

##### key

`string`

##### ttlMs?

`number`

#### Returns

`Promise`\<`StoragePipeline`\>

***

### zAdd()

> **zAdd**(`key`, `score`, `member`): `Promise`\<`StoragePipeline`\>

Defined in: [src/core/storage.ts:97](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L97)

#### Parameters

##### key

`string`

##### score

`number`

##### member

`string`

#### Returns

`Promise`\<`StoragePipeline`\>

***

### zCount()

> **zCount**(`key`): `Promise`\<`StoragePipeline`\>

Defined in: [src/core/storage.ts:99](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L99)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`StoragePipeline`\>

***

### zRangeWithScores()

> **zRangeWithScores**(`key`, `start`, `stop`): `Promise`\<`StoragePipeline`\>

Defined in: [src/core/storage.ts:100](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L100)

#### Parameters

##### key

`string`

##### start

`number`

##### stop

`number`

#### Returns

`Promise`\<`StoragePipeline`\>

***

### zRemoveRangeByScore()

> **zRemoveRangeByScore**(`key`, `min`, `max`): `Promise`\<`StoragePipeline`\>

Defined in: [src/core/storage.ts:98](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L98)

#### Parameters

##### key

`string`

##### min

`number`

##### max

`number`

#### Returns

`Promise`\<`StoragePipeline`\>
