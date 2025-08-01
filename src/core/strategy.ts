/**
 * @file Defines the core interfaces and implementations for rate limiting strategies.
 */

import { RedisClientType } from 'redis'
import { slidingWindow } from '../scripts'
import { RedisStorage, Storage } from './storage'

/**
 * Represents the result of a rate limit check.
 */
export interface RateLimiterResult {
    allowed: boolean
    limit: number
    remaining: number
    reset: number
}

/**
 * Defines the contract for a rate limiting strategy.
 *
 * This interface represents the core contract that all rate limiting strategies must implement.
 * Each strategy defines how to handle rate limiting for a specific algorithm (e.g., fixed window, sliding window).
 */
export interface RateLimitStrategy {
    /**
     * Checks if a request is allowed based on the rate limiting rules.
     *
     * @param identifier A unique string identifying the client (e.g., IP address).
     * @returns A promise that resolves to a `RateLimiterResult` indicating whether the request is allowed.
     */
    limit(identifier: string): Promise<RateLimiterResult>
}

/**
 * Defines the contract for a strategy factory function.
 *
 * A StrategyFactory is a higher-order function that creates and configures
 * rate limiting strategy instances. It encapsulates the creation logic and
 * dependencies, making it easy to create pre-configured strategies.
 *
 * @template T The type of strategy to create (e.g., FixedWindowStrategy, SlidingWindowStrategy).
 *
 * @example
 * ```typescript
 * // Create a factory for a fixed window strategy
 * const createFixedWindow = (windowMs: number, limit: number): StrategyFactory<FixedWindowStrategy> => {
 *   return ({ storage, prefix }) => {
 *     return new FixedWindowStrategy(storage, prefix, windowMs, limit);
 *   };
 * };
 *
 * // Use the factory
 * const factory = createFixedWindow(60000, 100); // 100 requests per minute
 * const strategy = factory({ storage, prefix: 'rate-limit:' });
 * ```
 *
 * @see createFixedWindowStrategy
 * @see createSlidingWindowStrategy
 */
export interface StrategyFactory<T> {
    /**
     * Creates a strategy instance with the provided context.
     *
     * @param context The context containing storage and prefix.
     * @param context.storage The storage instance to use for persisting rate limit data.
     * @param context.prefix The prefix to use for all storage keys to avoid collisions.
     * @returns An instance of the strategy.
     *
     * @example
     * ```typescript
     * const strategy = factory({
     *   storage: new MemoryStorage(),
     *   prefix: 'myapp:'
     * });
     * ```
     */
    (context: { storage: Storage; prefix: string }): T
}

/**
 * Implements the Fixed Window rate limiting strategy using a generic storage backend.
 *
 * The fixed window strategy divides time into fixed intervals (windows) and allows
 * a maximum number of requests within each window. Once the limit is reached,
 * subsequent requests are denied until the next window begins.
 *
 * This strategy is simple and efficient, with constant time complexity O(1) for
 * both memory and computation. However, it can allow up to 2x the limit in a
 * short period when traffic spikes occur at window boundaries.
 *
 * @example
 * ```typescript
 * const storage = new MemoryStorage();
 * const strategy = new FixedWindowStrategy(storage, 'rate-limit:', 60000, 100);
 * const result = await strategy.limit('user-123');
 * if (!result.allowed) {
 *   console.log(`Rate limit exceeded. Try again in ${Math.ceil(result.reset / 1000)} seconds`);
 * }
 * ```
 */
export class FixedWindowStrategy implements RateLimitStrategy {
    private storage: Storage
    private prefix: string
    private windowMs: number
    private requestLimit: number

    /**
     * Creates a new FixedWindowStrategy instance.
     *
     * @param storage The storage instance to use.
     * @param prefix The prefix for storage keys.
     * @param windowMs The duration of the time window in milliseconds.
     * @param requestLimit The maximum number of requests allowed within the window.
     */
    constructor(
        storage: Storage,
        prefix: string,
        windowMs: number,
        requestLimit: number
    ) {
        this.storage = storage
        this.prefix = prefix
        this.windowMs = windowMs
        this.requestLimit = requestLimit
    }

    /**
     * Checks if a request is allowed based on the fixed window rate limiting rules.
     *
     * @param identifier A unique string identifying the client (e.g., IP address).
     * @returns A promise that resolves to a `RateLimiterResult` indicating whether the request is allowed.
     */
    async limit(identifier: string): Promise<RateLimiterResult> {
        const key = `${this.prefix}:fixed-window:${identifier}`
        const now = Date.now()

        const count = await this.storage.increment(key, this.windowMs)
        const allowed = count <= this.requestLimit
        const remaining = allowed ? this.requestLimit - count : 0

        return {
            allowed,
            limit: this.requestLimit,
            remaining: Math.max(0, remaining),
            reset: now + this.windowMs,
        }
    }
}

/**
 * Implements the Sliding Window rate limiting strategy using a generic storage backend.
 *
 * The sliding window strategy provides a more accurate rate limiting approach by
 * considering the request rate over a rolling time window. It uses a sorted set
 * to track request timestamps and allows a maximum number of requests within
 * any window of the specified duration.
 *
 * This strategy is more accurate than the fixed window approach but requires
 * more storage and computation (O(log n) time complexity for Redis operations).
 * It prevents the "2x limit" issue of the fixed window strategy.
 *
 * @example
 * ```typescript
 * const storage = new MemoryStorage();
 * const strategy = new SlidingWindowStrategy(storage, 'rate-limit:', 60000, 100);
 * const result = await strategy.limit('user-123');
 * if (!result.allowed) {
 *   console.log(`Rate limit exceeded. Try again in ${Math.ceil(result.reset / 1000)} seconds`);
 * }
 * ```
 */
export class SlidingWindowStrategy implements RateLimitStrategy {
    private storage: Storage
    private prefix: string
    private windowMs: number
    private requestLimit: number

    /**
     * Creates a new SlidingWindowStrategy instance.
     *
     * @param storage The storage instance to use.
     * @param prefix The prefix for storage keys.
     * @param windowMs The duration of the time window in milliseconds.
     * @param requestLimit The maximum number of requests allowed within the window.
     */
    constructor(
        storage: Storage,
        prefix: string,
        windowMs: number,
        requestLimit: number
    ) {
        this.storage = storage
        this.prefix = prefix
        this.windowMs = windowMs
        this.requestLimit = requestLimit
    }

    /**
     * Checks if a request is allowed based on the sliding window rate limiting rules.
     *
     * @param identifier A unique string identifying the client (e.g., IP address).
     * @returns A promise that resolves to a `RateLimiterResult` indicating whether the request is allowed.
     */
    async limit(identifier: string): Promise<RateLimiterResult> {
        const key = `${this.prefix}:sliding-window:${identifier}`
        const now = Date.now()
        const random = Math.random().toString(36).slice(2)

        // If using Redis, leverage the optimized Lua script for atomicity.
        if (this.storage instanceof RedisStorage) {
            return this.limitWithLuaScript(key, now, random)
        }

        // For other storage types (like in-memory), perform operations sequentially.
        // This is acceptable for single-threaded environments like Node.js.
        const windowStart = now - this.windowMs
        await this.storage.zRemoveRangeByScore(key, 0, windowStart)
        const currentRequests = await this.storage.zCount(key)

        if (currentRequests >= this.requestLimit) {
            const oldestRequests = await this.storage.zRangeWithScores(
                key,
                0,
                0
            )
            const resetTime = (oldestRequests[0]?.score || now) + this.windowMs
            return {
                allowed: false,
                remaining: 0,
                reset: resetTime,
                limit: this.requestLimit,
            }
        }

        await this.storage.zAdd(key, now, `${now}:${random}`)
        await this.storage.expire(key, this.windowMs)

        const remaining = this.requestLimit - (currentRequests + 1)
        const oldestRequests = await this.storage.zRangeWithScores(key, 0, 0)
        const resetTime = (oldestRequests[0]?.score || now) + this.windowMs

        return {
            allowed: true,
            remaining,
            reset: resetTime,
            limit: this.requestLimit,
        }
    }

    /**
     * Checks if a request is allowed using a Lua script for atomicity when using Redis.
     *
     * @param key The storage key for this identifier.
     * @param now The current timestamp.
     * @param random A random string to ensure uniqueness of entries.
     * @returns A promise that resolves to a `RateLimiterResult` indicating whether the request is allowed.
     */
    private async limitWithLuaScript(
        key: string,
        now: number,
        random: string
    ): Promise<RateLimiterResult> {
        // The RedisStorage instance is cast to `any` to access the private `redis` property.
        // This is a controlled way to access the underlying client for script execution.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const redis = (this.storage as any).redis as RedisClientType
        const rawResult = await redis.eval(slidingWindow, {
            keys: [key],
            arguments: [
                now.toString(),
                this.windowMs.toString(),
                this.requestLimit.toString(),
                random,
            ],
        })

        const [allowed, remaining, reset] = rawResult as [
            number,
            number,
            number,
        ]
        return {
            allowed: Boolean(allowed),
            remaining,
            reset,
            limit: this.requestLimit,
        }
    }
}
