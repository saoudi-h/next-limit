import { describe, it, expect, vi, Mock } from 'vitest'
import { RateLimiter } from '../../src/core/rate-limiter'
import { RateLimitStrategy, RateLimiterResult } from '../../src/core/strategy'
import { MemoryStorageAdapter } from '../../src/core/memory-storage-adapter'
import { FixedWindowStrategy } from '../../src/strategies/fixed-window'
import { SlidingWindowStrategy } from '../../src/strategies/sliding-window'

describe('RateLimiter', () => {
    const mockStrategy: RateLimitStrategy = {
        limit: vi.fn(),
    }
    const storage = new MemoryStorageAdapter()
    const windowMs = 60000

    it('should call the strategy and return its result when allowed', async () => {
        const successResult: RateLimiterResult = {
            allowed: true,
            remaining: 4,
            reset: 12345,
        }
        ;(mockStrategy.limit as Mock).mockResolvedValue(successResult)

        const limiter = new RateLimiter({
            strategy: mockStrategy,
            limit: 5,
            storage,
            windowMs,
        })
        const result = await limiter.isAllowed('user1')

        expect(mockStrategy.limit).toHaveBeenCalledWith('user1')
        expect(result).toEqual(successResult)
    })

    it('should call the strategy and return its result when denied', async () => {
        const deniedResult: RateLimiterResult = {
            allowed: false,
            remaining: 0,
            reset: 67890,
        }
        ;(mockStrategy.limit as Mock).mockResolvedValue(deniedResult)

        const limiter = new RateLimiter({
            strategy: mockStrategy,
            limit: 5,
            storage,
            windowMs,
        })
        const result = await limiter.isAllowed('user1')

        expect(result).toEqual(deniedResult)
    })

    describe('onError policy', () => {
        it('should deny the request by default if the strategy throws an error', async () => {
            ;(mockStrategy.limit as Mock).mockRejectedValue(
                new Error('Storage error')
            )

            const limiter = new RateLimiter({
                strategy: mockStrategy,
                limit: 5,
                storage,
                windowMs,
            })
            const result = await limiter.isAllowed('user1')

            expect(result.allowed).toBe(false)
            expect(result.remaining).toBe(0)
        })

        it("should allow the request if onError is set to 'allow' and the strategy throws", async () => {
            ;(mockStrategy.limit as Mock).mockRejectedValue(
                new Error('Storage error')
            )

            const limiter = new RateLimiter({
                strategy: mockStrategy,
                onError: 'allow',
                limit: 5,
                storage,
                windowMs,
            })
            const result = await limiter.isAllowed('user1')

            expect(result.allowed).toBe(true)
            expect(result.remaining).toBe(5)
        })

        it("should throw an error if onError is set to 'throw' and the strategy throws", async () => {
            const storageError = new Error('Storage error')
            const strategy: RateLimitStrategy = {
                limit: vi.fn().mockRejectedValue(storageError),
            }

            const limiter = new RateLimiter({
                strategy,
                limit: 10,
                onError: 'throw',
                storage,
                windowMs,
            })

            await expect(limiter.isAllowed('test')).rejects.toThrow(
                storageError
            )
            expect(strategy.limit).toHaveBeenCalledWith('test')
        })
    })

    describe('Constructor logic', () => {
        const storage = new MemoryStorageAdapter()

        it('should create a FixedWindowStrategy instance when "fixed-window" is specified', () => {
            const limiter = new RateLimiter({
                storage,
                strategy: 'fixed-window',
                windowMs: 60000,
                limit: 10,
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((limiter as any).strategy).toBeInstanceOf(
                FixedWindowStrategy
            )
        })

        it('should create a SlidingWindowStrategy instance when "sliding-window" is specified', () => {
            const limiter = new RateLimiter({
                storage,
                strategy: 'sliding-window',
                windowMs: 60000,
                limit: 10,
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((limiter as any).strategy).toBeInstanceOf(
                SlidingWindowStrategy
            )
        })

        it('should throw an error for an unknown built-in strategy', () => {
            expect(() => {
                new RateLimiter({
                    storage,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    strategy: 'unknown-strategy' as any,
                    windowMs: 60000,
                    limit: 10,
                })
            }).toThrow('Unknown built-in strategy: unknown-strategy')
        })
    })
})
