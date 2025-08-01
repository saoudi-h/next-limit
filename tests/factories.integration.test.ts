import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createRedisStorage } from '../src/factories'
import { RedisStorage } from '../src/core/storage'
import { RedisClientType, createClient } from 'redis'
import type { RedisLike } from '../src/types/redis'

describe('createRedisStorage', () => {
    let redisClient: RedisClientType

    // Connect a client before each test
    beforeEach(async () => {
        redisClient = createClient({ url: process.env.REDIS_URL })
        await redisClient.connect()
    })

    // Destroy the client after each test
    afterEach(async () => {
        if (redisClient?.isReady) {
            await redisClient.destroy()
        }
    })

    it('should return an instance of RedisStorage when given a connected client', () => {
        const storage = createRedisStorage(redisClient as unknown as RedisLike)
        expect(storage).toBeInstanceOf(RedisStorage)
    })

    it('should return an instance of RedisStorage when given a URL', () => {
        const storage = createRedisStorage({ url: process.env.REDIS_URL })
        expect(storage).toBeInstanceOf(RedisStorage)
    })

    it('should return an instance of RedisStorage when given a sync factory', async () => {
        const factory = () => redisClient as unknown as RedisLike
        const storage = createRedisStorage(factory)
        expect(storage).toBeInstanceOf(RedisStorage)
        // Test that it works
        await storage.set('foo', 'bar')
        const value = await storage.get('foo')
        expect(value).toBe('bar')
    })

    it('should return an instance of RedisStorage when given an async factory', async () => {
        let factoryClient: RedisClientType | undefined
        const factory = async () => {
            factoryClient = createClient({ url: process.env.REDIS_URL })
            await factoryClient.connect()
            return factoryClient as unknown as RedisLike
        }

        const storage = createRedisStorage(factory)
        expect(storage).toBeInstanceOf(RedisStorage)

        // Test that it works and connects lazily
        await storage.set('foo', 'bar')
        const value = await storage.get('foo')
        expect(value).toBe('bar')

        // Destroy the client created by the factory
        if (factoryClient?.isReady) {
            await factoryClient.destroy()
        }
    })

    it('should return an instance of RedisStorage with full options', async () => {
        const storage = createRedisStorage({
            redis: redisClient as unknown as RedisLike,
            keyPrefix: 'test-prefix',
        })
        expect(storage).toBeInstanceOf(RedisStorage)
        // Test that it works
        await storage.set('foo', 'bar')
        const value = await redisClient.get('test-prefix:foo')
        expect(value).toBe('bar')
    })

    it('should return an instance of RedisStorage with auto-creation options', () => {
        const storage = createRedisStorage({
            url: process.env.REDIS_URL,
            keyPrefix: 'test-prefix',
            autoConnect: true,
        })
        expect(storage).toBeInstanceOf(RedisStorage)
    })
})
