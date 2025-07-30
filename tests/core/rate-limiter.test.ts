import { describe, it, expect, vi, Mock } from 'vitest'
import { RateLimiter } from '../../src/core/rate-limiter'
import { RateLimitStrategy, RateLimiterResult } from '../../src/core/strategy'

describe('RateLimiter', () => {
    const mockStrategy: RateLimitStrategy = {
        limit: vi.fn(),
    }

    it('should call the strategy and return its result when allowed', async () => {
        const successResult: RateLimiterResult = {
            allowed: true,
            remaining: 4,
            reset: 12345,
        }
        ;(mockStrategy.limit as Mock).mockResolvedValue(successResult)

        const limiter = new RateLimiter({ strategy: mockStrategy, limit: 5 })
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

        const limiter = new RateLimiter({ strategy: mockStrategy, limit: 5 })
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
            })
            const result = await limiter.isAllowed('user1')

            expect(result.allowed).toBe(true)
            expect(result.remaining).toBe(5)
        })

        it("should throw an error if onError is set to 'throw' and the strategy throws", async () => {
            const testError = new Error('Storage error')
            ;(mockStrategy.limit as Mock).mockRejectedValue(testError)

            const limiter = new RateLimiter({
                strategy: mockStrategy,
                onError: 'throw',
                limit: 5,
            })

            await expect(limiter.isAllowed('user1')).rejects.toThrow(testError)
        })
    })
})
