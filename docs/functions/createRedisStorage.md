[**next-limit**](../README.md)

***

[next-limit](../README.md) / createRedisStorage

# Function: createRedisStorage()

> **createRedisStorage**(`config`): [`RedisStorage`](../interfaces/RedisStorage.md)

Defined in: [src/factories.ts:327](https://github.com/saoudi-h/next-limit/blob/f416490a04def3b4fa337260ecf1c729b660c4a7/src/factories.ts#L327)

Creates a Redis-backed storage backend for rate limiting.

This function provides a flexible way to create a RedisStorage instance with
various configuration options. It's suitable for distributed applications
that need to share rate limit state across multiple processes or servers.

## Parameters

### config

Configuration options for the Redis storage. This can be:
  - A Redis client instance
  - A function that returns a Redis client or a Promise of a Redis client
  - A RedisStorageOptions object for more control
  - An AutoRedisConfig object for automatic client creation

[`RedisLike`](../interfaces/RedisLike.md) | [`RedisStorageOptions`](../interfaces/RedisStorageOptions.md) | [`AutoRedisConfig`](../interfaces/AutoRedisConfig.md) | () => `Promise`\<[`RedisLike`](../interfaces/RedisLike.md)\> | () => [`RedisLike`](../interfaces/RedisLike.md)

## Returns

[`RedisStorage`](../interfaces/RedisStorage.md)

A configured RedisStorage instance

## Example

```typescript
// Auto-create a client from a URL
const redisStorage = createRedisStorage({ url: 'redis://localhost:6379' });

// Use an existing Redis client
import { createClient } from 'redis';
const redisClient = createClient();
await redisClient.connect();
const redisStorageWithClient = createRedisStorage(redisClient);

// Use a lazy factory function
const redisStorageWithFactory = createRedisStorage(async () => {
  const client = createClient();
  await client.connect();
  return client;
});

// Use full RedisStorageOptions
const redisStorageWithOptions = createRedisStorage({
  redis: redisClient,
  keyPrefix: 'myapp',
  timeout: 3000
});
```

## See

 - RedisStorage
 - RedisStorageOptions
 - AutoRedisConfig
