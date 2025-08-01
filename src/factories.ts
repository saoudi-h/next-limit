/**
 * @module
 * This is the primary entry point for configuring and creating rate limiters.
 */

import { createClient, RedisClientOptions } from 'redis'
import ms, { StringValue } from 'ms'
import { RateLimiter, RateLimiterInstance } from './core/rate-limiter'
import {
    FixedWindowStrategy,
    SlidingWindowStrategy,
    StrategyFactory,
    RateLimitStrategy,
} from './core/strategy'
import {
    MemoryStorage,
    RedisStorage,
    RedisStorageOptions,
    Storage,
} from './core/storage'
import type { RedisLike } from './types/redis'

// --- Strategy Configuration Types ---

/**
 * Common options for all window-based strategies.
 */
export interface WindowOptions {
    /**
     * The duration of the time window in milliseconds or as a string.
     * @example 60000, '1m', '1h'
     */
    windowMs: number | StringValue

    /**
     * The maximum number of requests allowed in the time window.
     */
    limit: number
}

// --- Rate Limiter Configuration Types ---

/**
 * Configuration for the main rate limiter.
 */
export interface RateLimiterConfig<T extends RateLimitStrategy> {
    /**
     * The strategy factory to use for rate limiting.
     * @see createFixedWindowStrategy
     * @see createSlidingWindowStrategy
     */
    strategy: StrategyFactory<T>

    /**
     * The storage backend to use for tracking requests.
     * @see createMemoryStorage
     * @see createRedisStorage
     */
    storage: Storage

    /**
     * A unique prefix for storage keys to avoid collisions.
     * If not provided, a unique prefix will be generated.
     */
    prefix?: string

    /**
     * The policy to apply when an error occurs in the storage backend.
     * - `throw`: Rethrow the error (default).
     * - `allow`: Allow the request to proceed.
     * - `deny`: Deny the request.
     */
    onError?: 'throw' | 'allow' | 'deny'
}

// --- Auto Redis Configuration ---

/**
 * Configuration for automatically creating a Redis client.
 */
export interface AutoRedisConfig extends RedisClientOptions {
    /**
     * Optional key prefix for Redis storage.
     */
    keyPrefix?: string

    /**
     * Whether to automatically connect the client.
     * @default true
     */
    autoConnect?: boolean

    /**
     * Timeout for Redis operations in milliseconds.
     * @default 5000
     */
    timeout?: number
}

// --- Factory Functions ---

/**
 * Creates a factory function for fixed window rate limiting strategies.
 *
 * This strategy is simple and efficient, with constant time complexity O(1) for
 * both memory and computation. It divides time into fixed intervals (windows)
 * and allows a maximum number of requests within each window.
 *
 * @param options Configuration options for the fixed window strategy
 * @returns A factory function that creates FixedWindowStrategy instances
 *
 * @example
 * ```typescript
 * const createStrategy = createFixedWindowStrategy({
 *   windowMs: 60000, // 1 minute window
 *   limit: 100       // Max 100 requests per window
 * });
 *
 * // Later, with storage and prefix
 * const strategy = createStrategy({ storage, prefix: 'rate-limit:' });
 * ```
 */
export function createFixedWindowStrategy(
    options: WindowOptions
): StrategyFactory<FixedWindowStrategy> {
    // Convert windowMs to milliseconds if it's a string
    const windowMs =
        typeof options.windowMs === 'string'
            ? ms(options.windowMs)
            : options.windowMs

    // Validate that windowMs is a valid positive number
    if (typeof windowMs !== 'number' || isNaN(windowMs) || windowMs <= 0) {
        throw new Error(
            `Invalid windowMs value: "${options.windowMs}". Please provide a valid duration string (e.g., '1h', '30m') or a positive number of milliseconds.`
        )
    }
    return (context: {
        storage: Storage
        prefix: string
    }): FixedWindowStrategy => {
        return new FixedWindowStrategy(
            context.storage,
            context.prefix,
            windowMs,
            options.limit
        )
    }
}

/**
 * Creates a factory function for sliding window rate limiting strategies.
 *
 * This strategy provides more accurate rate limiting by considering a rolling
 * time window. It uses Redis sorted sets to track request timestamps and
 * allows a maximum number of requests within any window of the specified duration.
 *
 * @param options Configuration options for the sliding window strategy
 * @returns A factory function that creates SlidingWindowStrategy instances
 *
 * @example
 * ```typescript
 * const createStrategy = createSlidingWindowStrategy({
 *   windowMs: 60000, // 1 minute window
 *   limit: 100       // Max 100 requests per window
 * });
 *
 * // Later, with storage and prefix
 * const strategy = createStrategy({ storage, prefix: 'rate-limit:' });
 * ```
 */
export function createSlidingWindowStrategy(
    options: WindowOptions
): StrategyFactory<SlidingWindowStrategy> {
    // Convert windowMs to milliseconds if it's a string
    const windowMs =
        typeof options.windowMs === 'string'
            ? ms(options.windowMs)
            : options.windowMs

    // Validate that windowMs is a valid positive number
    if (typeof windowMs !== 'number' || isNaN(windowMs) || windowMs <= 0) {
        throw new Error(
            `Invalid windowMs value: "${options.windowMs}". Please provide a valid duration string (e.g., '1h', '30m') or a positive number of milliseconds.`
        )
    }
    return (context: {
        storage: Storage
        prefix: string
    }): SlidingWindowStrategy => {
        return new SlidingWindowStrategy(
            context.storage,
            context.prefix,
            windowMs,
            options.limit
        )
    }
}

/**
 * Creates and configures a rate limiter instance.
 *
 * @example
 * ```ts
 * const limiter = createRateLimiter({
 *   strategy: createFixedWindowStrategy({ windowMs: '1m', limit: 100 }),
 *   storage: createMemoryStorage(),
 *   prefix: 'my-app',
 * });
 *
 * const { success } = await limiter.limit('user-123');
 * if (!success) {
 *   // Rate limit exceeded
 * }
 * ```
 */
export function createRateLimiter<T extends RateLimitStrategy>(
    config: RateLimiterConfig<T>
): RateLimiterInstance {
    const prefix = config.prefix ?? `rl:${Math.random().toString(36).slice(2)}`

    const strategy = config.strategy({
        storage: config.storage,
        prefix,
    })

    return new RateLimiter({
        strategy,
        storage: config.storage,
        onError: config.onError,
    })
}

/**
 * Creates an in-memory storage backend.
 * This is useful for single-process applications or for testing.
 */
export function createMemoryStorage(): Storage {
    return new MemoryStorage()
}

// --- Type Guards ---

/**
 * Checks if the provided object is a RedisLike instance.
 */
function isRedisLike(obj: unknown): obj is RedisLike {
    return (
        !!obj &&
        typeof obj === 'object' &&
        'get' in obj &&
        'set' in obj &&
        typeof obj.get === 'function' &&
        typeof obj.set === 'function'
    )
}

/**
 * Checks if the provided object is a RedisStorageOptions configuration.
 */
function isRedisStorageOptions(obj: unknown): obj is RedisStorageOptions {
    return (
        !!obj &&
        typeof obj === 'object' &&
        'redis' in obj &&
        (isRedisLike(obj.redis) || typeof obj.redis === 'function')
    )
}

/**
 * Checks if the provided object is an AutoRedisConfig configuration.
 */
function isAutoRedisConfig(obj: unknown): obj is AutoRedisConfig {
    return (
        !!obj &&
        typeof obj === 'object' &&
        !('redis' in obj) && // RedisStorageOptions has 'redis', AutoRedisConfig doesn't
        !isRedisLike(obj) && // Not a Redis client instance
        typeof obj !== 'function' // Not a factory function
    )
}

/**
 * Creates a Redis-backed storage backend for rate limiting.
 *
 * This function provides a flexible way to create a RedisStorage instance with
 * various configuration options. It's suitable for distributed applications
 * that need to share rate limit state across multiple processes or servers.
 *
 * @param config Configuration options for the Redis storage. This can be:
 *   - A Redis client instance
 *   - A function that returns a Redis client or a Promise of a Redis client
 *   - A RedisStorageOptions object for more control
 *   - An AutoRedisConfig object for automatic client creation
 * @returns A configured RedisStorage instance
 *
 * @example
 * ```typescript
 * // Auto-create a client from a URL
 * const redisStorage = createRedisStorage({ url: 'redis://localhost:6379' });
 *
 * // Use an existing Redis client
 * import { createClient } from 'redis';
 * const redisClient = createClient();
 * await redisClient.connect();
 * const redisStorageWithClient = createRedisStorage(redisClient);
 *
 * // Use a lazy factory function
 * const redisStorageWithFactory = createRedisStorage(async () => {
 *   const client = createClient();
 *   await client.connect();
 *   return client;
 * });
 *
 * // Use full RedisStorageOptions
 * const redisStorageWithOptions = createRedisStorage({
 *   redis: redisClient,
 *   keyPrefix: 'myapp',
 *   timeout: 3000
 * });
 * ```
 *
 * @see RedisStorage
 * @see RedisStorageOptions
 * @see AutoRedisConfig
 */
export function createRedisStorage(
    config:
        | RedisStorageOptions
        | AutoRedisConfig
        | RedisLike
        | (() => Promise<RedisLike>)
        | (() => RedisLike)
): RedisStorage {
    // Case 1: Full RedisStorageOptions object
    if (isRedisStorageOptions(config)) {
        return new RedisStorage(config)
    }

    // Case 2: Redis-like client instance
    if (isRedisLike(config)) {
        return new RedisStorage({ redis: config })
    }

    // Case 3: Factory function (sync or async)
    if (typeof config === 'function') {
        return new RedisStorage({ redis: config })
    }

    // Case 4: AutoRedisConfig for client auto-creation
    if (isAutoRedisConfig(config)) {
        const {
            keyPrefix,
            autoConnect = true,
            timeout,
            ...redisClientOptions
        } = config

        const redisFactory = async (): Promise<RedisLike> => {
            const client = createClient(
                redisClientOptions
            ) as unknown as RedisLike
            if (autoConnect && client.connect) {
                await client.connect()
            }
            return client
        }

        const storageOptions: RedisStorageOptions = {
            redis: redisFactory,
            autoConnect,
            timeout,
        }

        if (keyPrefix) {
            storageOptions.keyPrefix = keyPrefix
        }

        return new RedisStorage(storageOptions)
    }

    throw new Error('Invalid configuration provided for createRedisStorage.')
}
