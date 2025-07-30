[**next-limit**](../README.md)

***

[next-limit](../README.md) / MemoryStorageAdapter

# Class: MemoryStorageAdapter

Defined in: [core/memory-storage-adapter.ts:14](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/memory-storage-adapter.ts#L14)

An in-memory storage adapter that uses a JavaScript `Map` to store rate limit data.
Expired entries are automatically cleared upon the next access.
This adapter is not suitable for distributed systems.

## Implements

- [`StorageAdapter`](../interfaces/StorageAdapter.md)

## Constructors

### Constructor

> **new MemoryStorageAdapter**(): `MemoryStorageAdapter`

#### Returns

`MemoryStorageAdapter`

## Methods

### evalSha()

> **evalSha**(`sha`, `keys`, `args`): `Promise`\<\[`boolean`, `number`, `number`\]\>

Defined in: [core/memory-storage-adapter.ts:64](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/memory-storage-adapter.ts#L64)

This method is not supported by the `MemoryStorageAdapter`.

#### Parameters

##### sha

`string`

##### keys

`string`[]

##### args

`string`[]

#### Returns

`Promise`\<\[`boolean`, `number`, `number`\]\>

#### Throws

Always throws an error indicating that Lua scripts are not supported.

#### Implementation of

[`StorageAdapter`](../interfaces/StorageAdapter.md).[`evalSha`](../interfaces/StorageAdapter.md#evalsha)

***

### increment()

> **increment**(`key`, `windowMs`): `Promise`\<\{ `count`: `number`; `ttl`: `number`; \}\>

Defined in: [core/memory-storage-adapter.ts:33](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/memory-storage-adapter.ts#L33)

Increments the hit count for a given key and sets an expiration date.
If the key is expired, it is reset before incrementing.

#### Parameters

##### key

`string`

The unique identifier for the client.

##### windowMs

`number`

The duration of the time window in milliseconds.

#### Returns

`Promise`\<\{ `count`: `number`; `ttl`: `number`; \}\>

A promise that resolves to an object containing the new hit count and the TTL in **milliseconds**.

#### Implementation of

[`StorageAdapter`](../interfaces/StorageAdapter.md).[`increment`](../interfaces/StorageAdapter.md#increment)

***

### scriptLoad()

> **scriptLoad**(`script`): `Promise`\<`string`\>

Defined in: [core/memory-storage-adapter.ts:83](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/memory-storage-adapter.ts#L83)

This method is not supported by the `MemoryStorageAdapter`.

#### Parameters

##### script

`string`

#### Returns

`Promise`\<`string`\>

#### Throws

Always throws an error indicating that Lua scripts are not supported.

#### Implementation of

[`StorageAdapter`](../interfaces/StorageAdapter.md).[`scriptLoad`](../interfaces/StorageAdapter.md#scriptload)
