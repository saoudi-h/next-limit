import { describe, it, expect } from 'vitest'
import {
    createMemoryStorage,
    createFixedWindowStrategy,
    createSlidingWindowStrategy,
    createRateLimiter,
} from '../src/factories'
import { MemoryStorage } from '../src/core/storage'
import {
    FixedWindowStrategy,
    SlidingWindowStrategy,
} from '../src/core/strategy'

describe('Storage Factories', () => {
    describe('createMemoryStorage', () => {
        it('should return an instance of MemoryStorage', () => {
            const storage = createMemoryStorage()
            expect(storage).toBeInstanceOf(MemoryStorage)
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
        })
    })
})
