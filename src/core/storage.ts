/**
 * @file Defines the generic storage interfaces for the rate limiter.
 * This decouples the rate limiting strategies from the underlying storage implementation.
 */

import type { RedisLike, RedisMultiLike } from '../types/redis'

export { RedisLike } from '../types/redis'

/**
 * Options for creating a `RedisStorage` instance.
 *
 * This interface defines the configuration options for initializing a Redis-based
 * storage backend for rate limiting. It supports both direct Redis client instances
 * and lazy-initialized clients via factory functions.
 *
 * @example
 * ```typescript
 * // Using a direct Redis client
 * const redisClient = createClient();
 * await redisClient.connect();
 * const options1: RedisStorageOptions = {
 *   redis: redisClient,
 *   keyPrefix: 'myapp:',
 *   autoConnect: false,
 *   timeout: 5000
 * };
 *
 * // Using a factory function (lazy initialization)
 * const options2: RedisStorageOptions = {
 *   redis: () => {
 *     const client = createClient({ url: 'redis://localhost:6379' });
 *     return client.connect().then(() => client);
 *   },
 *   keyPrefix: 'myapp:'
 * };
 * ```
 */
export interface RedisStorageOptions {
    /**
     * An existing Redis client instance, or a factory function to create one.
     * The factory can be synchronous or asynchronous.
     */
    redis: RedisLike | (() => Promise<RedisLike>) | (() => RedisLike)

    /**
     * An optional prefix for all keys stored in Redis.
     * @default ''
     */
    keyPrefix?: string

    /**
     * Whether to automatically manage the Redis connection.
     * If true, it will attempt to connect if the client is not ready.
     * @default true
     */
    autoConnect?: boolean

    /**
     * Timeout for Redis operations in milliseconds.
     * @default 5000
     */
    timeout?: number
}

/**
 * Defines the contract for storage implementations used by the rate limiter.
 *
 * This interface abstracts the storage layer, allowing different storage backends
 * (in-memory, Redis, etc.) to be used interchangeably. It provides methods for
 * basic key-value operations with TTL support, as well as sorted set operations
 * used by certain rate limiting strategies.
 */
export interface Storage {
    /**
     * Retrieves the value of a key.
     */
    get(key: string): Promise<string | null>

    /**
     * Sets the value of a key, with an optional TTL.
     */
    set(key: string, value: string, ttlMs?: number): Promise<void>

    /**
     * Deletes a key.
     */
    delete(key: string): Promise<void>

    /**
     * Checks if a key exists.
     */
    exists(key: string): Promise<boolean>

    /**
     * Atomically increments a numeric value stored at a key.
     */
    increment(key: string, ttlMs?: number): Promise<number>

    /**
     * Adds a member with a score to a sorted set.
     */
    zAdd(key: string, score: number, member: string): Promise<void>

    /**
     * Removes members from a sorted set by score range.
     */
    zRemoveRangeByScore(key: string, min: number, max: number): Promise<number>

    /**
     * Counts the number of members in a sorted set.
     */
    zCount(key: string): Promise<number>

    /**
     * Retrieves a range of members from a sorted set, with their scores.
     */
    zRangeWithScores(
        key: string,
        start: number,
        stop: number
    ): Promise<Array<{ member: string; score: number }>>

    /**
     * Creates a new pipeline for executing atomic operations.
     */
    pipeline(): StoragePipeline

    /**
     * Sets an expiration time on a key.
     */
    expire(key: string, ttlMs: number): Promise<void>
}

/**
 * An interface for storage pipeline implementations.
 */
export interface StoragePipeline {
    increment(key: string, ttlMs?: number): Promise<this>
    zAdd(key: string, score: number, member: string): Promise<this>
    zRemoveRangeByScore(key: string, min: number, max: number): Promise<this>
    zCount(key: string): Promise<this>
    zRangeWithScores(key: string, start: number, stop: number): Promise<this>
    expire(key: string, ttlMs: number): Promise<this>
    exec(): Promise<unknown[]>
}

/**
 * A Redis-based implementation of the `Storage` interface.
 *
 * This class provides a Redis-backed storage solution for rate limiting,
 * making it suitable for distributed applications that need to share rate limit
 * state across multiple processes or servers.
 *
 * @example
 * ```typescript
 * // Create with a Redis client instance
 * const redisClient = createClient();
 * await redisClient.connect();
 * const storage = new RedisStorage(redisClient);
 *
 * // Or with options
 * const storageWithOptions = new RedisStorage({
 *   redis: redisClient,
 *   keyPrefix: 'myapp',
 *   autoConnect: true,
 *   timeout: 5000
 * });
 * ```
 */
export class RedisStorage implements Storage {
    public redis: RedisLike
    private redisFactory?: () => Promise<RedisLike> | RedisLike
    private keyPrefix: string
    private autoConnect: boolean
    private timeout: number
    private isConnecting = false
    private isInitialized = false

    constructor(options: RedisStorageOptions | RedisLike) {
        if (this.isRedisLike(options)) {
            this.redis = options
            this.keyPrefix = ''
            this.autoConnect = true
            this.timeout = 5000
            this.isInitialized = true
        } else {
            this.keyPrefix = options.keyPrefix || ''
            this.autoConnect = options.autoConnect ?? true
            this.timeout = options.timeout ?? 5000

            if (typeof options.redis === 'function') {
                this.redisFactory = options.redis
                // Lazy initialization: redis will be created on first use
                this.redis = null as unknown as RedisLike
            } else {
                this.redis = options.redis
                this.isInitialized = true
            }
        }
    }

    private isRedisLike(obj: unknown): obj is RedisLike {
        return !!obj && typeof obj === 'object' && 'get' in obj && 'set' in obj
    }

    public async ensureReady(): Promise<void> {
        if (this.isInitialized) {
            await this.ensureConnection()
            return
        }

        if (this.isConnecting) {
            // Wait for the connection to be established
            await new Promise<void>(resolve => {
                const interval = setInterval(() => {
                    if (this.isInitialized) {
                        clearInterval(interval)
                        resolve()
                    }
                }, 100)
            })
            await this.ensureConnection()
            return
        }

        if (this.redisFactory) {
            this.isConnecting = true
            try {
                this.redis = await Promise.resolve(this.redisFactory())
                this.isInitialized = true
            } finally {
                this.isConnecting = false
            }
            await this.ensureConnection()
        } else if (!this.isInitialized) {
            throw new Error('Redis client not initialized.')
        }
    }

    private async ensureConnection(): Promise<void> {
        if (!this.autoConnect) return

        if (this.redis.isReady === false && this.redis.connect) {
            await this.redis.connect()
        }
    }

    private getKey(key: string): string {
        // Fix: Ensure the prefix ends with ':' if it's not empty
        if (this.keyPrefix) {
            const prefix = this.keyPrefix.endsWith(':')
                ? this.keyPrefix
                : `${this.keyPrefix}:`
            return `${prefix}${key}`
        }
        return key
    }

    private withTimeout<T>(promise: Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(
                    new Error(
                        `Redis operation timed out after ${this.timeout}ms`
                    )
                )
            }, this.timeout)

            promise
                .then(resolve)
                .catch(reject)
                .finally(() => clearTimeout(timeoutId))
        })
    }

    async get(key: string): Promise<string | null> {
        await this.ensureReady()
        return this.withTimeout(this.redis.get(this.getKey(key)))
    }

    async set(key: string, value: string, ttlMs?: number): Promise<void> {
        await this.ensureReady()
        const redisKey = this.getKey(key)

        if (ttlMs) {
            await this.withTimeout(
                this.redis.set(redisKey, value, { EX: Math.ceil(ttlMs / 1000) })
            )
        } else {
            await this.withTimeout(this.redis.set(redisKey, value))
        }
    }

    async delete(key: string): Promise<void> {
        await this.ensureReady()
        await this.withTimeout(this.redis.del(this.getKey(key)))
    }

    async exists(key: string): Promise<boolean> {
        await this.ensureReady()
        const result = await this.withTimeout(
            this.redis.exists(this.getKey(key))
        )
        return result === 1
    }

    async increment(key: string, ttlMs?: number): Promise<number> {
        await this.ensureReady()
        const redisKey = this.getKey(key)

        const pipeline = this.redis.multi()
        pipeline.incr(redisKey)
        if (ttlMs) {
            pipeline.pExpire(redisKey, ttlMs)
        }

        const results = await this.withTimeout(pipeline.exec())
        return results![0] as number
    }

    async zAdd(key: string, score: number, member: string): Promise<void> {
        await this.ensureReady()
        await this.withTimeout(
            this.redis.zAdd(this.getKey(key), { score, value: member })
        )
    }

    async zRemoveRangeByScore(
        key: string,
        min: number,
        max: number
    ): Promise<number> {
        await this.ensureReady()
        return this.withTimeout(
            this.redis.zRemRangeByScore(this.getKey(key), min, max)
        )
    }

    async zCount(key: string): Promise<number> {
        await this.ensureReady()
        return this.withTimeout(this.redis.zCard(this.getKey(key)))
    }

    async zRangeWithScores(
        key: string,
        start: number,
        stop: number
    ): Promise<Array<{ member: string; score: number }>> {
        await this.ensureReady()
        const results = await this.withTimeout(
            this.redis.zRangeWithScores(this.getKey(key), start, stop)
        )
        return results.map(item => ({ member: item.value, score: item.score }))
    }

    pipeline(): StoragePipeline {
        return new RedisPipeline(this, this.keyPrefix)
    }

    async expire(key: string, ttlMs: number): Promise<void> {
        await this.ensureReady()
        await this.withTimeout(this.redis.pExpire(this.getKey(key), ttlMs))
    }
}

export class RedisPipeline implements StoragePipeline {
    private multi: RedisMultiLike | null = null

    constructor(
        private storage: RedisStorage,
        private keyPrefix: string
    ) {}

    private async initialize(): Promise<void> {
        if (!this.multi) {
            await this.storage.ensureReady()
            this.multi = this.storage.redis.multi()
        }
    }

    private getKey(key: string): string {
        if (this.keyPrefix) {
            const prefix = this.keyPrefix.endsWith(':')
                ? this.keyPrefix
                : `${this.keyPrefix}:`
            return `${prefix}${key}`
        }
        return key
    }

    async increment(key: string, ttlMs?: number): Promise<this> {
        await this.initialize()
        const redisKey = this.getKey(key)
        this.multi!.incr(redisKey)
        if (ttlMs) {
            this.multi!.pExpire(redisKey, ttlMs)
        }
        return this
    }

    async zAdd(key: string, score: number, member: string): Promise<this> {
        await this.initialize()
        this.multi!.zAdd(this.getKey(key), { score, value: member })
        return this
    }

    async zRemoveRangeByScore(
        key: string,
        min: number,
        max: number
    ): Promise<this> {
        await this.initialize()
        this.multi!.zRemRangeByScore(this.getKey(key), min, max)
        return this
    }

    async zCount(key: string): Promise<this> {
        await this.initialize()
        this.multi!.zCard(this.getKey(key))
        return this
    }

    async zRangeWithScores(
        key: string,
        start: number,
        stop: number
    ): Promise<this> {
        await this.initialize()
        this.multi!.zRangeWithScores(this.getKey(key), start, stop)
        return this
    }

    async expire(key: string, ttlMs: number): Promise<this> {
        await this.initialize()
        this.multi!.pExpire(this.getKey(key), ttlMs)
        return this
    }

    async exec(): Promise<unknown[]> {
        if (!this.multi) {
            return []
        }
        return this.multi.exec()
    }
}

/**
 * An in-memory implementation of the `Storage` interface.
 *
 * This implementation stores all data in memory and is primarily intended for
 * testing or single-process applications. It is not suitable for distributed
 * environments as the state is not shared between processes.
 *
 * @example
 * ```typescript
 * const storage = new MemoryStorage();
 * await storage.set('key', 'value', 60000); // TTL of 60 seconds
 * const value = await storage.get('key');
 * ```
 */
export class MemoryStorage implements Storage {
    private store = new Map<string, string>()
    private expirations = new Map<string, number>()
    private zsets = new Map<string, Array<{ score: number; member: string }>>()

    private checkExpired(key: string): void {
        if (
            this.expirations.has(key) &&
            this.expirations.get(key)! < Date.now()
        ) {
            this.store.delete(key)
            this.expirations.delete(key)
            this.zsets.delete(key)
        }
    }

    async get(key: string): Promise<string | null> {
        this.checkExpired(key)
        return this.store.get(key) ?? null
    }

    async set(key: string, value: string, ttlMs?: number): Promise<void> {
        this.store.set(key, value)
        if (ttlMs) {
            this.expirations.set(key, Date.now() + ttlMs)
        } else {
            this.expirations.delete(key)
        }
    }

    async delete(key: string): Promise<void> {
        this.store.delete(key)
        this.expirations.delete(key)
        this.zsets.delete(key)
    }

    async exists(key: string): Promise<boolean> {
        this.checkExpired(key)
        return this.store.has(key)
    }

    async increment(key: string, ttlMs?: number): Promise<number> {
        this.checkExpired(key)
        const currentValue = parseInt(this.store.get(key) ?? '0', 10)
        const newValue = currentValue + 1
        this.store.set(key, newValue.toString())
        if (ttlMs) {
            this.expirations.set(key, Date.now() + ttlMs)
        }
        return newValue
    }

    async zAdd(key: string, score: number, member: string): Promise<void> {
        this.checkExpired(key)
        if (!this.zsets.has(key)) {
            this.zsets.set(key, [])
        }
        const zset = this.zsets.get(key)!
        // Remove existing member to update score
        const existingIndex = zset.findIndex(item => item.member === member)
        if (existingIndex > -1) {
            zset.splice(existingIndex, 1)
        }
        zset.push({ score, member })
        zset.sort((a, b) => a.score - b.score)
    }

    async zRemoveRangeByScore(
        key: string,
        min: number,
        max: number
    ): Promise<number> {
        this.checkExpired(key)
        if (!this.zsets.has(key)) return 0
        const zset = this.zsets.get(key)!
        const originalLength = zset.length
        const filtered = zset.filter(
            item => item.score < min || item.score > max
        )
        this.zsets.set(key, filtered)
        return originalLength - filtered.length
    }

    async zCount(key: string): Promise<number> {
        this.checkExpired(key)
        return this.zsets.get(key)?.length ?? 0
    }

    async zRangeWithScores(
        key: string,
        start: number,
        stop: number
    ): Promise<Array<{ member: string; score: number }>> {
        this.checkExpired(key)
        const zset = this.zsets.get(key) ?? []
        const end = stop === -1 ? undefined : stop + 1
        return zset.slice(start, end)
    }

    pipeline(): StoragePipeline {
        return new MemoryPipeline(this)
    }

    async expire(key: string, ttlMs: number): Promise<void> {
        if (this.store.has(key)) {
            this.expirations.set(key, Date.now() + ttlMs)
        }
    }
}

class MemoryPipeline implements StoragePipeline {
    private commands: Array<() => Promise<unknown>> = []

    constructor(private storage: MemoryStorage) {}

    increment(key: string, ttlMs?: number): Promise<this> {
        this.commands.push(() => this.storage.increment(key, ttlMs))
        return Promise.resolve(this)
    }

    zAdd(key: string, score: number, member: string): Promise<this> {
        this.commands.push(() => this.storage.zAdd(key, score, member))
        return Promise.resolve(this)
    }

    zRemoveRangeByScore(key: string, min: number, max: number): Promise<this> {
        this.commands.push(() =>
            this.storage.zRemoveRangeByScore(key, min, max)
        )
        return Promise.resolve(this)
    }

    zCount(key: string): Promise<this> {
        this.commands.push(() => this.storage.zCount(key))
        return Promise.resolve(this)
    }

    zRangeWithScores(key: string, start: number, stop: number): Promise<this> {
        this.commands.push(() =>
            this.storage.zRangeWithScores(key, start, stop)
        )
        return Promise.resolve(this)
    }

    expire(key: string, ttlMs: number): Promise<this> {
        this.commands.push(() => this.storage.expire(key, ttlMs))
        return Promise.resolve(this)
    }

    async exec(): Promise<unknown[]> {
        return Promise.all(this.commands.map(cmd => cmd()))
    }
}
