import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MemoryStorage, RedisStorage } from '../../src/core/storage'
import { createClient, RedisClientType } from 'redis'

describe('Storage Implementations', () => {
    // --- MemoryStorage Tests ---
    describe('MemoryStorage', () => {
        let storage: MemoryStorage

        beforeEach(() => {
            storage = new MemoryStorage()
        })

        it('should increment a key and set TTL', async () => {
            const key = 'test_increment'
            const ttl = 1000 // 1 second

            const firstIncr = await storage.increment(key, ttl)
            expect(firstIncr).toBe(1)

            const secondIncr = await storage.increment(key, ttl)
            expect(secondIncr).toBe(2)

            // Verify TTL is working (difficult to test with exact timing, so we check existence)
            const value = await storage.get(key)
            expect(value).toBe('2')
        })

        it('should perform sorted set operations correctly', async () => {
            const key = 'test_zset'
            const now = Date.now()

            await storage.zAdd(key, now - 2000, 'member1')
            await storage.zAdd(key, now - 1000, 'member2')
            await storage.zAdd(key, now, 'member3')

            const count = await storage.zCount(key)
            expect(count).toBe(3)

            const removed = await storage.zRemoveRangeByScore(
                key,
                0,
                now - 1500
            )
            expect(removed).toBe(1)

            const newCount = await storage.zCount(key)
            expect(newCount).toBe(2)

            const range = await storage.zRangeWithScores(key, 0, -1)
            expect(range).toHaveLength(2)
            expect(range[0].member).toBe('member2')
            expect(range[0].score).toBe(now - 1000)
        })

        it('should execute a pipeline of commands atomically', async () => {
            const key1 = 'pipeline_incr'
            const key2 = 'pipeline_zset'

            const pipeline = storage.pipeline()
            pipeline.increment(key1)
            pipeline.zAdd(key2, 100, 'member1')
            pipeline.zCount(key2)

            const results = await pipeline.exec()

            expect(results).toEqual([1, undefined, 1])

            const finalIncr = await storage.get(key1)
            expect(finalIncr).toBe('1')

            const finalZCount = await storage.zCount(key2)
            expect(finalZCount).toBe(1)
        })
    })

    // --- RedisStorage Integration Tests ---
    describe('RedisStorage', () => {
        let redis: RedisClientType
        let storage: RedisStorage

        beforeEach(async () => {
            if (!process.env.REDIS_URL) {
                vi.skip()
                return
            }
            redis = createClient({ url: process.env.REDIS_URL })
            await redis.connect()
            storage = new RedisStorage(redis as unknown as RedisClientType)

            // Clean up before each test
            await redis.flushDb()
        })

        it('should increment a key and set TTL', async () => {
            const key = 'test_increment_redis'
            const ttl = 1000

            const firstIncr = await storage.increment(key, ttl)
            expect(firstIncr).toBe(1)

            const secondIncr = await storage.increment(key, ttl)
            expect(secondIncr).toBe(2)

            const value = await redis.get(key)
            expect(value).toBe('2')

            const pttl = await redis.pTTL(key)
            expect(pttl).toBeGreaterThan(0)
        })

        it('should perform sorted set operations correctly', async () => {
            const key = 'test_zset_redis'
            const now = Date.now()

            await storage.zAdd(key, now - 2000, 'member1')
            await storage.zAdd(key, now - 1000, 'member2')
            await storage.zAdd(key, now, 'member3')

            const count = await storage.zCount(key)
            expect(count).toBe(3)

            const removed = await storage.zRemoveRangeByScore(
                key,
                0,
                now - 1500
            )
            expect(removed).toBe(1)

            const newCount = await storage.zCount(key)
            expect(newCount).toBe(2)

            const range = await storage.zRangeWithScores(key, 0, -1)
            expect(range).toHaveLength(2)
            expect(range[0].member).toBe('member2')
        })

        it('should execute a pipeline of commands atomically', async () => {
            const key1 = 'pipeline_incr_redis'
            const key2 = 'pipeline_zset_redis'

            const pipeline = storage.pipeline()
            pipeline.increment(key1)
            pipeline.zAdd(key2, 100, 'member1')
            pipeline.zCount(key2)

            const results = await pipeline.exec()

            expect(results).toEqual([1, 1, 1])

            const finalIncr = await redis.get(key1)
            expect(finalIncr).toBe('1')

            const finalZCount = await redis.zCard(key2)
            expect(finalZCount).toBe(1)
        })
    })
})
