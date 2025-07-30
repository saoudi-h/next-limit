[**next-limit**](../README.md)

***

[next-limit](../README.md) / createRedisStorage

# Function: createRedisStorage()

> **createRedisStorage**(`redis`): `StorageAdapter`

Defined in: [helpers.ts:26](https://github.com/saoudi-h/next-limit/blob/364f5bf04c9ecd59b43c48876b352d3650948f61/src/helpers.ts#L26)

Creates a new `RedisStorageAdapter` instance.

## Parameters

### redis

`RedisClientType`

An initialized and connected `RedisClientType` instance from the `redis` package.

## Returns

`StorageAdapter`

A new instance of `RedisStorageAdapter`.

## Example

```typescript
import { createClient } from 'redis';
import { createRedisStorage } from 'next-limit';

const redisClient = createClient();
await redisClient.connect();
const storage = createRedisStorage(redisClient);
```
