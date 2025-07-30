/**
 * @file Provides helper functions for creating storage adapters.
 * These factories simplify the process of instantiating common storage adapters.
 */

import { RedisClientType } from 'redis'
import { MemoryStorageAdapter } from './core/memory-storage-adapter'
import { RedisStorageAdapter } from './core/redis-storage-adapter'
import { StorageAdapter } from './core/storage'

/**
 * Creates a new `RedisStorageAdapter` instance.
 *
 * @param redis An initialized and connected `RedisClientType` instance from the `redis` package.
 * @returns A new instance of `RedisStorageAdapter`.
 * @example
 * ```typescript
 * import { createClient } from 'redis';
 * import { createRedisStorage } from 'next-limit';
 *
 * const redisClient = createClient();
 * await redisClient.connect();
 * const storage = createRedisStorage(redisClient);
 * ```
 */
export const createRedisStorage = (redis: RedisClientType): StorageAdapter => {
    return new RedisStorageAdapter(redis)
}

/**
 * Creates a new `MemoryStorageAdapter` instance.
 *
 * @returns A new instance of `MemoryStorageAdapter`.
 * @example
 * ```typescript
 * import { createMemoryStorage } from 'next-limit';
 *
 * const storage = createMemoryStorage();
 * ```
 */
export const createMemoryStorage = (): StorageAdapter => {
    return new MemoryStorageAdapter()
}
