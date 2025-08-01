/**
 * @file Defines the generic storage interfaces for the rate limiter.
 * This decouples the rate limiting strategies from the underlying storage implementation.
 */

import type { RedisClientType } from 'redis'

/**
 * Defines the contract for a generic storage pipeline for atomic operations.
 */
export interface StoragePipeline {
    increment(key: string, ttlMs?: number): this
    zAdd(key: string, score: number, member: string): this
    zRemoveRangeByScore(key: string, min: number, max: number): this
    zCount(key: string): this
    zRangeWithScores(key: string, start: number, stop: number): this
    expire(key: string, ttlMs: number): this
    exec(): Promise<unknown[]>
}

/**
 * Defines the contract for a generic storage adapter.
 * It provides a set of methods for interacting with a storage backend,
 * abstracting away the specific details of the database (e.g., Redis, in-memory).
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
 * A generic implementation of `Storage` for in-memory storage.
 * Useful for testing and development environments.
 */
export class MemoryStorage implements Storage {
    private store = new Map<
        string,
        { value: string | number; expiresAt?: number }
    >()
    private sortedSets = new Map<string, Map<string, number>>() // key -> member -> score

    private cleanup(key: string): void {
        const entry = this.store.get(key)
        if (entry?.expiresAt && entry.expiresAt < Date.now()) {
            this.store.delete(key)
            this.sortedSets.delete(key)
        }
    }

    async get(key: string): Promise<string | null> {
        this.cleanup(key)
        const entry = this.store.get(key)
        return entry ? String(entry.value) : null
    }

    async set(key: string, value: string, ttlMs?: number): Promise<void> {
        const entry = {
            value,
            expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
        }
        this.store.set(key, entry)
    }

    async delete(key: string): Promise<void> {
        this.store.delete(key)
        this.sortedSets.delete(key)
    }

    async exists(key: string): Promise<boolean> {
        this.cleanup(key)
        return this.store.has(key)
    }

    async increment(key: string, ttlMs?: number): Promise<number> {
        this.cleanup(key)
        const current = this.store.get(key)
        const newValue = (current ? Number(current.value) : 0) + 1

        await this.set(key, String(newValue), ttlMs)
        return newValue
    }

    async zAdd(key: string, score: number, member: string): Promise<void> {
        this.cleanup(key)
        if (!this.sortedSets.has(key)) {
            this.sortedSets.set(key, new Map())
        }
        this.sortedSets.get(key)!.set(member, score)

        // Maintain the main entry for expiration
        if (!this.store.has(key)) {
            this.store.set(key, { value: 'zset' })
        }
    }

    async zRemoveRangeByScore(
        key: string,
        min: number,
        max: number
    ): Promise<number> {
        this.cleanup(key)
        const sortedSet = this.sortedSets.get(key)
        if (!sortedSet) return 0

        let removed = 0
        for (const [member, score] of sortedSet.entries()) {
            if (score >= min && score <= max) {
                sortedSet.delete(member)
                removed++
            }
        }
        return removed
    }

    async zCount(key: string): Promise<number> {
        this.cleanup(key)
        return this.sortedSets.get(key)?.size || 0
    }

    async zRangeWithScores(
        key: string,
        start: number,
        stop: number
    ): Promise<Array<{ member: string; score: number }>> {
        this.cleanup(key)
        const sortedSet = this.sortedSets.get(key)
        if (!sortedSet) return []

        const entries = Array.from(sortedSet.entries())
            .map(([member, score]) => ({ member, score }))
            .sort((a, b) => a.score - b.score)

        const end = stop === -1 ? entries.length : stop + 1
        return entries.slice(start, end)
    }

    pipeline(): StoragePipeline {
        return new MemoryPipeline(this)
    }

    async expire(key: string, ttlMs: number): Promise<void> {
        const entry = this.store.get(key)
        if (entry) {
            entry.expiresAt = Date.now() + ttlMs
        }
    }
}

class MemoryPipeline implements StoragePipeline {
    private operations: Array<() => Promise<unknown>> = []

    constructor(private storage: MemoryStorage) {}

    increment(key: string, ttlMs?: number): this {
        this.operations.push(() => this.storage.increment(key, ttlMs))
        return this
    }

    zAdd(key: string, score: number, member: string): this {
        this.operations.push(() => this.storage.zAdd(key, score, member))
        return this
    }

    zRemoveRangeByScore(key: string, min: number, max: number): this {
        this.operations.push(() =>
            this.storage.zRemoveRangeByScore(key, min, max)
        )
        return this
    }

    zCount(key: string): this {
        this.operations.push(() => this.storage.zCount(key))
        return this
    }

    zRangeWithScores(key: string, start: number, stop: number): this {
        this.operations.push(() =>
            this.storage.zRangeWithScores(key, start, stop)
        )
        return this
    }

    expire(key: string, ttlMs: number): this {
        this.operations.push(() => this.storage.expire(key, ttlMs))
        return this
    }

    async exec(): Promise<unknown[]> {
        return Promise.all(this.operations.map(op => op()))
    }
}

/**
 * A generic implementation of `Storage` for Redis.
 * Ideal for production and distributed environments.
 */
export class RedisStorage implements Storage {
    constructor(private redis: RedisClientType) {}

    async get(key: string): Promise<string | null> {
        return this.redis.get(key)
    }

    async set(key: string, value: string, ttlMs?: number): Promise<void> {
        if (ttlMs) {
            await this.redis.setEx(key, Math.ceil(ttlMs / 1000), value)
        } else {
            await this.redis.set(key, value)
        }
    }

    async delete(key: string): Promise<void> {
        await this.redis.del(key)
    }

    async exists(key: string): Promise<boolean> {
        return (await this.redis.exists(key)) === 1
    }

    async increment(key: string, ttlMs?: number): Promise<number> {
        const pipeline = this.redis.multi()
        pipeline.incr(key)
        if (ttlMs) {
            pipeline.pExpire(key, ttlMs)
        }
        const results = await pipeline.exec()
        return results![0] as unknown as number
    }

    async zAdd(key: string, score: number, member: string): Promise<void> {
        await this.redis.zAdd(key, { score, value: member })
    }

    async zRemoveRangeByScore(
        key: string,
        min: number,
        max: number
    ): Promise<number> {
        return this.redis.zRemRangeByScore(key, min, max)
    }

    async zCount(key: string): Promise<number> {
        return this.redis.zCard(key)
    }

    async zRangeWithScores(
        key: string,
        start: number,
        stop: number
    ): Promise<Array<{ member: string; score: number }>> {
        const results = await this.redis.zRangeWithScores(key, start, stop)
        return results.map(item => ({ member: item.value, score: item.score }))
    }

    pipeline(): StoragePipeline {
        return new RedisPipeline(this.redis.multi())
    }

    async expire(key: string, ttlMs: number): Promise<void> {
        await this.redis.pExpire(key, ttlMs)
    }
}

class RedisPipeline implements StoragePipeline {
    constructor(private multi: ReturnType<RedisClientType['multi']>) {}

    increment(key: string, ttlMs?: number): this {
        this.multi.incr(key)
        if (ttlMs) {
            this.multi.pExpire(key, ttlMs)
        }
        return this
    }

    zAdd(key: string, score: number, member: string): this {
        this.multi.zAdd(key, { score, value: member })
        return this
    }

    zRemoveRangeByScore(key: string, min: number, max: number): this {
        this.multi.zRemRangeByScore(key, min, max)
        return this
    }

    zCount(key: string): this {
        this.multi.zCard(key)
        return this
    }

    zRangeWithScores(key: string, start: number, stop: number): this {
        this.multi.zRangeWithScores(key, start, stop)
        return this
    }

    expire(key: string, ttlMs: number): this {
        this.multi.pExpire(key, ttlMs)
        return this
    }

    async exec(): Promise<unknown[]> {
        return this.multi.exec()
    }
}
