import { describe, it, expect, vi } from 'vitest'
import { FixedWindowStrategy } from '../../src/strategies/fixed-window'
import { StorageAdapter } from '../../src/core/storage'

describe('FixedWindowStrategy', () => {
    const windowMs = 60000
    const limit = 5
    const prefix = 'test'

    it('should allow a request if the limit is not reached', async () => {
        const mockStorage: StorageAdapter = {
            increment: vi.fn().mockResolvedValue({ count: 1, ttl: windowMs }),
            evalSha: vi.fn(),
            scriptLoad: vi.fn(),
        }

        const strategy = new FixedWindowStrategy(
            mockStorage,
            windowMs,
            limit,
            prefix
        )
        const result = await strategy.limit('user1')

        expect(result.allowed).toBe(true)
        expect(result.remaining).toBe(4) // 5 - 1
        expect(mockStorage.increment).toHaveBeenCalledWith(
            `${prefix}:fixed-window:user1`,
            windowMs
        )
    })

    it('should deny a request if the limit is reached', async () => {
        // This test simulates the 6th request, which should be denied.
        const mockStorage: StorageAdapter = {
            increment: vi.fn().mockResolvedValue({ count: 6, ttl: windowMs }),
            evalSha: vi.fn(),
            scriptLoad: vi.fn(),
        }

        const strategy = new FixedWindowStrategy(
            mockStorage,
            windowMs,
            limit,
            prefix
        )
        const result = await strategy.limit('user1')

        expect(result.allowed).toBe(false)
        expect(result.remaining).toBe(0) // 5 - 5
    })

    it('should handle the case where the count exceeds the limit', async () => {
        const mockStorage: StorageAdapter = {
            increment: vi.fn().mockResolvedValue({ count: 6, ttl: windowMs }),
            evalSha: vi.fn(),
            scriptLoad: vi.fn(),
        }

        const strategy = new FixedWindowStrategy(
            mockStorage,
            windowMs,
            limit,
            prefix
        )
        const result = await strategy.limit('user1')

        expect(result.allowed).toBe(false)
        expect(result.remaining).toBe(0) // Should be capped at 0
    })

    it('should calculate the reset time correctly', async () => {
        const now = Date.now()
        vi.spyOn(Date, 'now').mockReturnValue(now)

        const mockStorage: StorageAdapter = {
            increment: vi.fn().mockResolvedValue({ count: 1, ttl: windowMs }),
            evalSha: vi.fn(),
            scriptLoad: vi.fn(),
        }

        const strategy = new FixedWindowStrategy(
            mockStorage,
            windowMs,
            limit,
            prefix
        )
        const result = await strategy.limit('user1')

        expect(result.reset).toBe(now + windowMs)

        vi.restoreAllMocks()
    })
})
