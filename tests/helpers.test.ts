import { describe, it, expect, vi } from 'vitest'
import { createMemoryStorage, createRedisStorage } from '../src/helpers'
import { MemoryStorageAdapter } from '../src/core/memory-storage-adapter'
import { RedisStorageAdapter } from '../src/core/redis-storage-adapter'
import { RedisClientType } from 'redis'

// Mock the adapter to verify it's instantiated correctly.
vi.mock('../src/core/redis-storage-adapter')

describe('Helpers', () => {
    describe('createMemoryStorage', () => {
        it('should return an instance of MemoryStorageAdapter', () => {
            const storage = createMemoryStorage()
            expect(storage).toBeInstanceOf(MemoryStorageAdapter)
        })
    })

    describe('createRedisStorage', () => {
        it('should instantiate RedisStorageAdapter with the provided client', () => {
            // Create a mock Redis client. The implementation doesn't matter.
            const mockRedisClient = {} as RedisClientType

            // Call the helper function.
            createRedisStorage(mockRedisClient)

            // Verify that RedisStorageAdapter was instantiated with the mock client.
            expect(RedisStorageAdapter).toHaveBeenCalledWith(mockRedisClient)
        })
    })
})
