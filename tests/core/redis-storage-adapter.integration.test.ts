import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { createClient, RedisClientType } from 'redis'
import { RedisStorageAdapter } from '../../src/core/redis-storage-adapter'

// Note: These are integration tests and require a running Redis server.
// Configure the connection using the REDIS_URL environment variable.
// Example: REDIS_URL="redis://:password@localhost:6379"
describe('RedisStorageAdapter', () => {
    let client: RedisClientType
    let storage: RedisStorageAdapter

    beforeAll(async () => {
        const url = process.env.REDIS_URL
        client = createClient({ url })

        try {
            await client.connect()
        } catch (error) {
            throw new Error(
                `Failed to connect to Redis. Make sure Redis is running and REDIS_URL is configured correctly. Error: ${error.message}`
            )
        }

        storage = new RedisStorageAdapter(client)
    })

    afterAll(async () => {
        await client.destroy()
    })

    beforeEach(async () => {
        // Clear the database before each test to ensure isolation
        await client.flushDb()
    })

    it('should increment a key and set the correct TTL', async () => {
        const key = 'test-key-redis'
        const windowMs = 60000 // 60 seconds

        const result1 = await storage.increment(key, windowMs)
        expect(result1.count).toBe(1)

        const result2 = await storage.increment(key, windowMs)
        expect(result2.count).toBe(2)

        // Check the TTL in Redis (it returns seconds)
        const ttl = await client.ttl(key)
        expect(ttl).toBeGreaterThan(58)
        expect(ttl).toBeLessThanOrEqual(60)
    })

    it('should return the remaining TTL in milliseconds', async () => {
        const key = 'test-key-ttl-redis'
        const windowMs = 60000 // 60 seconds

        const result = await storage.increment(key, windowMs)
        expect(result.ttl).toBeGreaterThan(59000)
        expect(result.ttl).toBeLessThanOrEqual(60000)
    })

    it('should load a Lua script and return its SHA hash', async () => {
        const script = 'return 1'
        const sha = await storage.scriptLoad(script)
        // SHA1 hashes are 40 characters long
        expect(sha).toBeTypeOf('string')
        expect(sha.length).toBe(40)
    })

    it('should execute a loaded Lua script using evalSha', async () => {
        const script = 'return {KEYS[1], ARGV[1]}'
        const sha = await client.scriptLoad(script)

        const keys = ['mykey']
        const args = ['my-arg']

        // The adapter is expected to return a tuple [boolean, number, number]
        // but for this test, we cast the result to check the raw script output.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (await storage.evalSha(sha, keys, args)) as any

        expect(result).toEqual(['mykey', 'my-arg'])
    })
})
