[**next-limit**](../README.md)

***

[next-limit](../README.md) / StorageAdapter

# Interface: StorageAdapter

Defined in: [core/storage.ts:13](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/storage.ts#L13)

Defines the contract for storage adapters.
Storage adapters are responsible for storing and retrieving rate limit data,
such as hit counts and timestamps.

## Methods

### evalSha()

> **evalSha**(`sha`, `keys`, `args`): `Promise`\<\[`boolean`, `number`, `number`\]\>

Defined in: [core/storage.ts:40](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/storage.ts#L40)

Executes a pre-loaded Lua script on the storage backend.
This method is essential for atomic operations required by complex strategies like "sliding-window".
It is typically used with a Redis-based storage adapter.

#### Parameters

##### sha

`string`

The SHA1 hash of the Lua script to execute.

##### keys

`string`[]

An array of key names to be passed to the script.

##### args

`string`[]

An array of argument values to be passed to the script.

#### Returns

`Promise`\<\[`boolean`, `number`, `number`\]\>

A promise that resolves to a tuple containing:
         - `[0]`: A boolean indicating if the request is allowed (`true`) or denied (`false`).
         - `[1]`: The number of remaining requests allowed in the current window.
         - `[2]`: The timestamp (in seconds) when the rate limit will reset.

***

### increment()

> **increment**(`key`, `windowMs`): `Promise`\<\{ `count`: `number`; `ttl`: `number`; \}\>

Defined in: [core/storage.ts:22](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/storage.ts#L22)

Increments the hit count for a given key within a specified time window.
This method is primarily used by the "fixed-window" strategy.

#### Parameters

##### key

`string`

The unique identifier for the client being rate-limited (e.g., an IP address).

##### windowMs

`number`

The duration of the time window in milliseconds. The key will be automatically expired after this period.

#### Returns

`Promise`\<\{ `count`: `number`; `ttl`: `number`; \}\>

A promise that resolves to an object containing the current hit count (`count`) and the key's time-to-live (`ttl`) in seconds.

***

### scriptLoad()

> **scriptLoad**(`script`): `Promise`\<`string`\>

Defined in: [core/storage.ts:53](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/core/storage.ts#L53)

Loads a Lua script into the storage backend (e.g., Redis) and returns its SHA1 hash.
Pre-loading scripts improves performance by avoiding the need to send the full script with each `evalSha` call.

#### Parameters

##### script

`string`

The Lua script content to load.

#### Returns

`Promise`\<`string`\>

A promise that resolves to the SHA1 hash of the loaded script.
