[**next-limit**](../README.md)

***

[next-limit](../README.md) / RedisStorageOptions

# Interface: RedisStorageOptions

Defined in: [src/core/storage.ts:39](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L39)

Options for creating a `RedisStorage` instance.

This interface defines the configuration options for initializing a Redis-based
storage backend for rate limiting. It supports both direct Redis client instances
and lazy-initialized clients via factory functions.

## Example

```typescript
// Using a direct Redis client
const redisClient = createClient();
await redisClient.connect();
const options1: RedisStorageOptions = {
  redis: redisClient,
  keyPrefix: 'myapp:',
  autoConnect: false,
  timeout: 5000
};

// Using a factory function (lazy initialization)
const options2: RedisStorageOptions = {
  redis: () => {
    const client = createClient({ url: 'redis://localhost:6379' });
    return client.connect().then(() => client);
  },
  keyPrefix: 'myapp:'
};
```

## Properties

### autoConnect?

> `optional` **autoConnect**: `boolean`

Defined in: [src/core/storage.ts:57](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L57)

Whether to automatically manage the Redis connection.
If true, it will attempt to connect if the client is not ready.

#### Default

```ts
true
```

***

### keyPrefix?

> `optional` **keyPrefix**: `string`

Defined in: [src/core/storage.ts:50](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L50)

An optional prefix for all keys stored in Redis.

#### Default

```ts
''
```

***

### redis

> **redis**: [`RedisLike`](RedisLike.md) \| () => `Promise`\<[`RedisLike`](RedisLike.md)\> \| () => [`RedisLike`](RedisLike.md)

Defined in: [src/core/storage.ts:44](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L44)

An existing Redis client instance, or a factory function to create one.
The factory can be synchronous or asynchronous.

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [src/core/storage.ts:63](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/core/storage.ts#L63)

Timeout for Redis operations in milliseconds.

#### Default

```ts
5000
```
