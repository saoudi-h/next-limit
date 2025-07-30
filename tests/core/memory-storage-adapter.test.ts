import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MemoryStorageAdapter } from '../../src/core/memory-storage-adapter'

describe('MemoryStorageAdapter', () => {
    let storage: MemoryStorageAdapter

    beforeEach(() => {
        storage = new MemoryStorageAdapter()
    })

    it('should initialize a new key with a count of 1', async () => {
        const key = 'test-key'
        const ttl = 60000
        const result = await storage.increment(key, ttl)
        expect(result.count).toBe(1)
        expect(result.ttl).toBe(ttl)
    })

    it('should increment an existing key', async () => {
        const key = 'test-key'
        const ttl = 60000
        await storage.increment(key, ttl)
        const result = await storage.increment(key, ttl)
        expect(result.count).toBe(2)
    })

    it('should reset the count for an expired key', async () => {
        vi.useFakeTimers()
        const key = 'test-key-expiry'
        const ttl = 30000 // 30 seconds

        // First increment
        await storage.increment(key, ttl)

        // Advance time past the TTL
        await vi.advanceTimersByTimeAsync(ttl + 1000)

        // Second increment should reset the count
        const result = await storage.increment(key, ttl)
        expect(result.count).toBe(1)

        vi.useRealTimers()
    })

    it('should return the correct remaining TTL', async () => {
        vi.useFakeTimers()
        const key = 'test-key-ttl'
        const ttl = 60000 // 60 seconds

        await storage.increment(key, ttl)

        // Advance time by 20 seconds
        await vi.advanceTimersByTimeAsync(20000)

        const result = await storage.increment(key, ttl)
        expect(result.count).toBe(2)
        // The remaining TTL should be roughly 40 seconds
        expect(result.ttl).toBeLessThanOrEqual(40000)
        expect(result.ttl).toBeGreaterThan(39000)

        vi.useRealTimers()
    })

    it('should throw an error when evalSha is called', async () => {
        const expectedError =
            'Lua scripts are not supported by the MemoryStorageAdapter. Use RedisStorageAdapter for sliding-window strategy.'
        await expect(storage.evalSha('sha', [], [])).rejects.toThrow(
            expectedError
        )
    })

    it('should throw an error when scriptLoad is called', async () => {
        const expectedError =
            'Lua scripts are not supported by the MemoryStorageAdapter. Use RedisStorageAdapter for sliding-window strategy.'
        await expect(storage.scriptLoad('script')).rejects.toThrow(
            expectedError
        )
    })
})
