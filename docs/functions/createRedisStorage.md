[**next-limit**](../README.md)

***

[next-limit](../README.md) / createRedisStorage

# Function: createRedisStorage()

> **createRedisStorage**(`redis`): `Storage`

Defined in: [factories.ts:248](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L248)

Creates a `RedisStorage` instance.

This function creates a new RedisStorage instance that uses Redis as the storage backend.
It's ideal for production and distributed environments where you need to share rate limiting
state across multiple application instances.

## Parameters

### redis

`RedisClientType`

An initialized and connected `RedisClientType` instance.

## Returns

`Storage`

A configured instance of `RedisStorage`.

## Example

```typescript
import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379'
});
await redisClient.connect();

const storage = createRedisStorage(redisClient);
```
