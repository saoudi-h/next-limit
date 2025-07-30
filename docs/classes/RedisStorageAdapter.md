[**next-limit**](../README.md)

***

[next-limit](../README.md) / RedisStorageAdapter

# Class: RedisStorageAdapter

Defined in: [core/redis-storage-adapter.ts:18](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/redis-storage-adapter.ts#L18)

A storage adapter that uses Redis as the backend.
It leverages Redis's atomic operations to ensure consistency in a distributed environment.
This adapter is required for the "sliding-window" strategy.

## Implements

- [`StorageAdapter`](../interfaces/StorageAdapter.md)

## Constructors

### Constructor

> **new RedisStorageAdapter**(`redis`): `RedisStorageAdapter`

Defined in: [core/redis-storage-adapter.ts:23](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/redis-storage-adapter.ts#L23)

Creates a new instance of the `RedisStorageAdapter`.

#### Parameters

##### redis

`RedisClientType`

An initialized and connected `RedisClientType` instance from the `redis` package.

#### Returns

`RedisStorageAdapter`

## Methods

### evalSha()

> **evalSha**(`sha`, `keys`, `args`): `Promise`\<\[`boolean`, `number`, `number`\]\>

Defined in: [core/redis-storage-adapter.ts:53](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/redis-storage-adapter.ts#L53)

Executes a pre-loaded Lua script on Redis using the `EVALSHA` command.
This is essential for the "sliding-window" strategy, which relies on a Lua script for atomic evaluation.

#### Parameters

##### sha

`string`

The SHA1 hash of the script to execute.

##### keys

`string`[]

An array of key names to be passed to the script.

##### args

`string`[]

An array of argument values to be passed to the script.

#### Returns

`Promise`\<\[`boolean`, `number`, `number`\]\>

A promise that resolves to the tuple returned by the Lua script.

#### Implementation of

[`StorageAdapter`](../interfaces/StorageAdapter.md).[`evalSha`](../interfaces/StorageAdapter.md#evalsha)

***

### increment()

> **increment**(`key`, `windowMs`): `Promise`\<\{ `count`: `number`; `ttl`: `number`; \}\>

Defined in: [core/redis-storage-adapter.ts:33](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/redis-storage-adapter.ts#L33)

Atomically increments a key and sets its expiration time in a single transaction.
This method is used by the "fixed-window" strategy.

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

Defined in: [core/redis-storage-adapter.ts:69](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/redis-storage-adapter.ts#L69)

Loads a Lua script into Redis using the `SCRIPT LOAD` command.

#### Parameters

##### script

`string`

The Lua script content to load.

#### Returns

`Promise`\<`string`\>

A promise that resolves to the SHA1 hash of the loaded script.

#### Implementation of

[`StorageAdapter`](../interfaces/StorageAdapter.md).[`scriptLoad`](../interfaces/StorageAdapter.md#scriptload)
