import { describe, it, expect, vi, Mock, beforeEach } from 'vitest'
import { createRateLimiter } from '../../src/factories'
import { RateLimitStrategy, RateLimiterResult } from '../../src/core/strategy'
import { Storage } from '../../src/core/storage'

describe('createRateLimiter', () => {
    const mockStorage: Storage = {
        get: vi.fn(),
        set: vi.fn(),
        delete: vi.fn(),
        exists: vi.fn(),
        increment: vi.fn(),
        zAdd: vi.fn(),
        zRemoveRangeByScore: vi.fn(),
        zCount: vi.fn(),
        zRangeWithScores: vi.fn(),
        pipeline: vi.fn(),
        expire: vi.fn(),
    }

    const mockStrategy: RateLimitStrategy = {
        limit: vi.fn(),
    }

    // Reset mocks before each test to ensure test isolation
    beforeEach(() => {
        ;(mockStrategy.limit as Mock).mockReset()
    })

    it('should call the strategy and return its result when allowed', async () => {
        const successResult: RateLimiterResult = {
            allowed: true,
            remaining: 4,
            reset: 12345,
            limit: 10,
        }
        ;(mockStrategy.limit as Mock).mockResolvedValue(successResult)

        const limiter = createRateLimiter({
            strategy: mockStrategy,
            storage: mockStorage,
        })
        const result = await limiter.consume('user1')

        expect(mockStrategy.limit).toHaveBeenCalledWith('user1', mockStorage)
        expect(result).toEqual(successResult)
    })

    it('should call the strategy and return its result when denied', async () => {
        const deniedResult: RateLimiterResult = {
            allowed: false,
            remaining: 0,
            reset: 67890,
            limit: 10,
        }
        ;(mockStrategy.limit as Mock).mockResolvedValue(deniedResult)

        const limiter = createRateLimiter({
            strategy: mockStrategy,
            storage: mockStorage,
        })
        const result = await limiter.consume('user1')

        expect(result).toEqual(deniedResult)
    })

    describe('onError policy', () => {
        it('should deny the request by default if the strategy throws an error', async () => {
            ;(mockStrategy.limit as Mock).mockRejectedValue(
                new Error('Storage error')
            )

            const limiter = createRateLimiter({
                strategy: mockStrategy,
                storage: mockStorage,
            })
            const result = await limiter.consume('user1')

            // The error handler should return a full RateLimiterResult object
            expect(result).toEqual({
                allowed: false,
                limit: -1,
                remaining: -1,
                reset: -1,
            })
        })

        it("should allow the request if onError is set to 'allow' and the strategy throws", async () => {
            ;(mockStrategy.limit as Mock).mockRejectedValue(
                new Error('Storage error')
            )

            const limiter = createRateLimiter({
                strategy: mockStrategy,
                storage: mockStorage,
                onError: 'allow',
            })
            const result = await limiter.consume('user1')

            // The error handler should return a full RateLimiterResult object
            expect(result).toEqual({
                allowed: true,
                limit: -1,
                remaining: -1,
                reset: -1,
            })
        })

        it("should throw an error if onError is set to 'throw' and the strategy throws", async () => {
            const storageError = new Error('Storage error')
            const strategy: RateLimitStrategy = {
                limit: vi.fn().mockRejectedValue(storageError),
            }

            const limiter = createRateLimiter({
                strategy,
                storage: mockStorage,
                onError: 'throw',
            })

            await expect(limiter.consume('test')).rejects.toThrow(storageError)
            expect(strategy.limit).toHaveBeenCalledWith('test', mockStorage)
        })
    })
})
