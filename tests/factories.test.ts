import { describe, it, expect, vi } from 'vitest'
import {
    createMemoryStorage,
    createRedisStorage,
    createFixedWindowStrategy,
    createSlidingWindowStrategy,
} from '../src/factories'
import { MemoryStorage, RedisStorage } from '../src/core/storage'
import type { RedisClientType as Redis } from 'redis'
import {
    FixedWindowStrategy,
    SlidingWindowStrategy,
} from '../src/core/strategy'

vi.mock('../src/core/storage', async importOriginal => {
    const original =
        await importOriginal<typeof import('../src/core/storage')>()
    return {
        ...original,
        RedisStorage: vi.fn(),
        MemoryStorage: class extends original.MemoryStorage {},
    }
})

describe('Storage Factories', () => {
    describe('createMemoryStorage', () => {
        it('should return an instance of MemoryStorage', () => {
            const storage = createMemoryStorage()
            expect(storage).toBeInstanceOf(MemoryStorage)
        })
    })

    describe('createRedisStorage', () => {
        it('should return an instance of RedisStorage', () => {
            const redisClient = {} as Redis
            createRedisStorage(redisClient)
            expect(RedisStorage).toHaveBeenCalledWith(redisClient)
        })
    })
})

describe('Strategy Factories', () => {
    const storage = createMemoryStorage()

    describe('createFixedWindowStrategy', () => {
        it('should create a fixed window strategy with default options', () => {
            const strategy = createFixedWindowStrategy(
                { windowMs: 60000, limit: 100 },
                storage
            )
            expect(strategy).toBeInstanceOf(FixedWindowStrategy)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- accessing private property for test
            expect((strategy as any).requestLimit).toBe(100)
        })

        it('should create a fixed window strategy with a custom prefix', () => {
            const strategy = createFixedWindowStrategy(
                { windowMs: 60000, limit: 100, prefix: 'custom-prefix' },
                storage
            )
            expect(strategy).toBeInstanceOf(FixedWindowStrategy)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- accessing private property for test
            expect((strategy as any).prefix).toBe('custom-prefix')
        })
    })

    describe('createSlidingWindowStrategy', () => {
        it('should create a sliding window strategy with default options', () => {
            const strategy = createSlidingWindowStrategy(
                { windowMs: 60000, limit: 100 },
                storage
            )
            expect(strategy).toBeInstanceOf(SlidingWindowStrategy)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- accessing private property for test
            expect((strategy as any).requestLimit).toBe(100)
        })

        it('should create a sliding window strategy with a custom prefix', () => {
            const strategy = createSlidingWindowStrategy(
                {
                    windowMs: 60000,
                    limit: 100,
                    prefix: 'custom-sliding-prefix',
                },
                storage
            )
            expect(strategy).toBeInstanceOf(SlidingWindowStrategy)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- accessing private property for test
            expect((strategy as any).prefix).toBe('custom-sliding-prefix')
        })
    })
})
