[**next-limit**](../README.md)

***

[next-limit](../README.md) / createRedisStorage

# Function: createRedisStorage()

> **createRedisStorage**(`redis`): [`StorageAdapter`](../interfaces/StorageAdapter.md)

Defined in: [helpers.ts:26](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/helpers.ts#L26)

Creates a new `RedisStorageAdapter` instance.

## Parameters

### redis

`RedisClientType`

An initialized and connected `RedisClientType` instance from the `redis` package.

## Returns

[`StorageAdapter`](../interfaces/StorageAdapter.md)

A new instance of `RedisStorageAdapter`.

## Example

```typescript
import { createClient } from 'redis';
import { createRedisStorage } from 'next-limit';

const redisClient = createClient();
await redisClient.connect();
const storage = createRedisStorage(redisClient);
```
