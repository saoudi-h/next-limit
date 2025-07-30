import { RedisClientType } from 'redis'
import { MemoryStorageAdapter } from './core/memory-storage-adapter'
import { RedisStorageAdapter } from './core/redis-storage-adapter'
import { StorageAdapter } from './core/storage'

export const createRedisStorage = (redis: RedisClientType): StorageAdapter => {
    return new RedisStorageAdapter(redis)
}

export const createMemoryStorage = (): StorageAdapter => {
    return new MemoryStorageAdapter()
}
