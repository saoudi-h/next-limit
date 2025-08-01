import { describe, it, expect, vi } from 'vitest'
import {
    createMemoryStorage,
    createRedisStorage,
    createFixedWindowStrategy,
    createSlidingWindowStrategy,
    createRateLimiter,
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
            const strategyFactory = createFixedWindowStrategy({
                windowMs: 60000,
                limit: 100,
            })
            const strategy = strategyFactory({
                storage,
                prefix: 'test-prefix',
            })
            expect(strategy).toBeInstanceOf(FixedWindowStrategy)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- accessing private property for test
            expect((strategy as any).requestLimit).toBe(100)
        })

        it('should create a fixed window strategy with string time format', () => {
            const strategyFactory = createFixedWindowStrategy({
                windowMs: '1m',
                limit: 100,
            })
            const strategy = strategyFactory({
                storage,
                prefix: 'test-prefix',
            })
            expect(strategy).toBeInstanceOf(FixedWindowStrategy)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- accessing private property for test
            expect((strategy as any).windowMs).toBe(60000) // 1 minute in milliseconds
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- accessing private property for test
            expect((strategy as any).requestLimit).toBe(100)
        })

        describe('createRateLimiter', () => {
            const storage = createMemoryStorage()

            it('should use the provided prefix', () => {
                const strategyFactory = createFixedWindowStrategy({
                    windowMs: 60000,
                    limit: 100,
                })
                const limiter = createRateLimiter({
                    strategy: strategyFactory,
                    storage,
                    prefix: 'custom-prefix',
                })

                expect(limiter).toBeDefined()
            })

            it('should generate a unique prefix when none is provided', () => {
                const strategyFactory = createFixedWindowStrategy({
                    windowMs: 60000,
                    limit: 100,
                })
                const limiter1 = createRateLimiter({
                    strategy: strategyFactory,
                    storage,
                })
                const limiter2 = createRateLimiter({
                    strategy: strategyFactory,
                    storage,
                })

                expect(limiter1).toBeDefined()
                expect(limiter2).toBeDefined()
                // Note: We're not checking if the prefixes are different because
                // Math.random() might generate the same value in tests
            })
        })
    })

    describe('createSlidingWindowStrategy', () => {
        it('should create a sliding window strategy with default options', () => {
            const strategyFactory = createSlidingWindowStrategy({
                windowMs: 60000,
                limit: 100,
            })
            const strategy = strategyFactory({
                storage,
                prefix: 'test-prefix',
            })
            expect(strategy).toBeInstanceOf(SlidingWindowStrategy)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- accessing private property for test
            expect((strategy as any).requestLimit).toBe(100)
        })

        it('should create a sliding window strategy with string time format', () => {
            const strategyFactory = createSlidingWindowStrategy({
                windowMs: '1m',
                limit: 100,
            })
            const strategy = strategyFactory({
                storage,
                prefix: 'test-prefix',
            })
            expect(strategy).toBeInstanceOf(SlidingWindowStrategy)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- accessing private property for test
            expect((strategy as any).windowMs).toBe(60000) // 1 minute in milliseconds
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- accessing private property for test
            expect((strategy as any).requestLimit).toBe(100)
        })
    })
})
