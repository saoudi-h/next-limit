import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest'
import { SlidingWindowStrategy } from '../../src/strategies/sliding-window'
import { StorageAdapter } from '../../src/core/storage'
import * as fs from 'fs'

// Mock the 'fs' module to control 'readFileSync'
vi.mock('fs', () => ({
    readFileSync: vi.fn().mockReturnValue('mock lua script'),
}))

describe('SlidingWindowStrategy', () => {
    const windowMs = 60000
    const limit = 5
    const prefix = 'test'
    let mockStorage: StorageAdapter

    beforeEach(() => {
        mockStorage = {
            increment: vi.fn(),
            scriptLoad: vi.fn().mockResolvedValue('test-sha-hash'),
            evalSha: vi.fn(),
        }
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should load the script on first call and cache the SHA', async () => {
        ;(mockStorage.evalSha as Mock).mockResolvedValue([
            true,
            4,
            Date.now() + windowMs,
        ])

        const strategy = new SlidingWindowStrategy(
            mockStorage,
            windowMs,
            limit,
            prefix
        )
        await strategy.limit('user1')
        await strategy.limit('user1') // Second call

        expect(fs.readFileSync).toHaveBeenCalledOnce()
        expect(mockStorage.scriptLoad).toHaveBeenCalledOnce()
        expect(mockStorage.evalSha).toHaveBeenCalledTimes(2)
    })

    it('should allow a request and return correct result when script allows it', async () => {
        const resetTime = Date.now() + windowMs
        ;(mockStorage.evalSha as Mock).mockResolvedValue([true, 4, resetTime])

        const strategy = new SlidingWindowStrategy(
            mockStorage,
            windowMs,
            limit,
            prefix
        )
        const result = await strategy.limit('user1')

        expect(result.allowed).toBe(true)
        expect(result.remaining).toBe(4)
        expect(result.reset).toBe(resetTime)
        expect(mockStorage.evalSha).toHaveBeenCalledWith(
            'test-sha-hash',
            [`${prefix}:sliding-window:user1`],
            [expect.any(String), windowMs.toString(), limit.toString()]
        )
    })

    it('should deny a request and return correct result when script denies it', async () => {
        const resetTime = Date.now() + windowMs
        ;(mockStorage.evalSha as Mock).mockResolvedValue([false, 0, resetTime])

        const strategy = new SlidingWindowStrategy(
            mockStorage,
            windowMs,
            limit,
            prefix
        )
        const result = await strategy.limit('user1')

        expect(result.allowed).toBe(false)
        expect(result.remaining).toBe(0)
        expect(result.reset).toBe(resetTime)
    })
})
