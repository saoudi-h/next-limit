/**
 * @file Contains factory functions for creating rate limiter components.
 * This is the primary entry point for configuring and creating rate limiters.
 */

import type { RedisClientType } from 'redis'
import type { StringValue } from 'ms'
import { RateLimiter, RateLimiterInstance } from './core/rate-limiter'
import {
    FixedWindowStrategy,
    RateLimitStrategy,
    SlidingWindowStrategy,
    StrategyFactory,
} from './core/strategy'
import { MemoryStorage, RedisStorage, Storage } from './core/storage'
import ms from 'ms'

// --- Strategy Configuration Types ---

/**
 * Configuration for the Fixed Window strategy.
 *
 * This interface defines the configuration options for the fixed window rate limiting strategy.
 * The fixed window strategy divides time into fixed intervals (windows) and allows
 * a maximum number of requests within each window.
 */
export interface FixedWindowStrategyConfig {
    /** The duration of the time window in milliseconds or a string format (e.g., "1m", "1h"). */
    windowMs: number | StringValue
    /** The maximum number of requests allowed within the window. */
    limit: number
}

/**
 * Configuration for the Sliding Window strategy.
 *
 * This interface defines the configuration options for the sliding window rate limiting strategy.
 * The sliding window strategy provides a more accurate rate limiting approach by
 * considering the request rate over a rolling time window.
 */
export interface SlidingWindowStrategyConfig {
    /** The duration of the time window in milliseconds or a string format (e.g., "1m", "1h"). */
    windowMs: number | StringValue
    /** The maximum number of requests allowed within the window. */
    limit: number
}

// --- Factory Functions ---

/**
 * Creates a factory function for a `FixedWindowStrategy` instance.
 *
 * This function returns a factory that, when executed with a context containing
 * storage and prefix, creates a new `FixedWindowStrategy` instance.
 *
 * @param config The configuration for the fixed window strategy.
 * @param config.windowMs The duration of the time window in milliseconds or a string format (e.g., "1m", "1h").
 * @param config.limit The maximum number of requests allowed within the window.
 * @returns A factory function that creates a `FixedWindowStrategy` instance.
 *
 * @example
 * ```typescript
 * const strategyFactory = createFixedWindowStrategy({
 *   windowMs: 60000, // 1 minute
 *   limit: 100,      // 100 requests per minute
 * });
 *
 * const strategy = strategyFactory({
 *   storage: createMemoryStorage(),
 *   prefix: 'my-app'
 * });
 * ```
 *
 * @example
 * ```typescript
 * const strategyFactory = createFixedWindowStrategy({
 *   windowMs: "1m", // 1 minute
 *   limit: 100,     // 100 requests per minute
 * });
 *
 * const strategy = strategyFactory({
 *   storage: createMemoryStorage(),
 *   prefix: 'my-app'
 * });
 * ```
 *
 * @throws Will throw an error if `windowMs` is not a valid positive number or a StringValue from `ms` (e.g., "1m", "1h").
 * @see https://github.com/vercel/ms for more information on string format.
 */
export function createFixedWindowStrategy(
    config: FixedWindowStrategyConfig
): StrategyFactory<RateLimitStrategy> {
    // Convert windowMs to milliseconds if it's a string
    const windowMs =
        typeof config.windowMs === 'string'
            ? ms(config.windowMs)
            : config.windowMs

    // Validate that windowMs is a valid positive number
    if (typeof windowMs !== 'number' || isNaN(windowMs) || windowMs <= 0) {
        throw new Error(
            `Invalid windowMs value: "${config.windowMs}". Please provide a valid duration string (e.g., '1h', '30m') or a positive number of milliseconds.`
        )
    }
    return (context: { storage: Storage; prefix: string }) => {
        return new FixedWindowStrategy(
            context.storage,
            context.prefix,
            windowMs,
            config.limit
        )
    }
}

/**
 * Creates a factory function for a `SlidingWindowStrategy` instance.
 *
 * This function returns a factory that, when executed with a context containing
 * storage and prefix, creates a new `SlidingWindowStrategy` instance.
 *
 * @param config The configuration for the sliding window strategy.
 * @param config.windowMs The duration of the time window in milliseconds or a string format (e.g., "1m", "1h").
 * @param config.limit The maximum number of requests allowed within the window.
 * @returns A factory function that creates a `SlidingWindowStrategy` instance.
 *
 * @example
 * ```typescript
 * const strategyFactory = createSlidingWindowStrategy({
 *   windowMs: 60000, // 1 minute
 *   limit: 100,      // 100 requests per minute
 * });
 *
 * const strategy = strategyFactory({
 *   storage: createMemoryStorage(),
 *   prefix: 'my-app'
 * });
 * ```
 *
 * @example
 * ```typescript
 * const strategyFactory = createSlidingWindowStrategy({
 *   windowMs: "1m", // 1 minute
 *   limit: 100,     // 100 requests per minute
 * });
 *
 * const strategy = strategyFactory({
 *   storage: createMemoryStorage(),
 *   prefix: 'my-app'
 * });
 * ```
 *
 * @throws Will throw an error if `windowMs` is not a valid positive number or a StringValue from `ms` (e.g., "1m", "1h").
 * @see https://github.com/vercel/ms for more information on string format.
 */
export function createSlidingWindowStrategy(
    config: SlidingWindowStrategyConfig
): StrategyFactory<RateLimitStrategy> {
    // Convert windowMs to milliseconds if it's a string
    const windowMs =
        typeof config.windowMs === 'string'
            ? ms(config.windowMs)
            : config.windowMs

    // Validate that windowMs is a valid positive number
    if (typeof windowMs !== 'number' || isNaN(windowMs) || windowMs <= 0) {
        throw new Error(
            `Invalid windowMs value: "${config.windowMs}". Please provide a valid duration string (e.g., '1h', '30m') or a positive number of milliseconds.`
        )
    }
    return (context: { storage: Storage; prefix: string }) => {
        return new SlidingWindowStrategy(
            context.storage,
            context.prefix,
            windowMs,
            config.limit
        )
    }
}

// --- Main Rate Limiter Factory ---

/**
 * Options for creating a rate limiter with the `createRateLimiter` factory.
 *
 * This interface defines the configuration options for creating a rate limiter instance.
 * It includes the strategy factory, storage instance, optional prefix, and error handling policy.
 */
export interface CreateRateLimiterOptions {
    /**
     * The rate limiting strategy factory to use.
     * Create this using a strategy factory like `createFixedWindowStrategy`.
     */
    strategy: StrategyFactory<RateLimitStrategy>

    /**
     * The storage instance to use.
     * Create this using a storage factory like `createMemoryStorage`.
     */
    storage: Storage

    /**
     * An optional prefix for storage keys.
     * If provided, it will be used as the prefix for all storage keys.
     * If not provided, a unique prefix will be automatically generated.
     */
    prefix?: string

    /**
     * Defines the behavior when a storage error occurs.
     * - 'allow': The request is allowed to proceed.
     * - 'deny': The request is denied (default).
     * - 'throw': The underlying storage error is thrown.
     * @default 'deny'
     */
    onError?: 'allow' | 'deny' | 'throw'
}

/**
 * Generates a unique prefix for the rate limiter.
 * @returns A unique string prefix.
 */
function generateUniquePrefix(): string {
    return 'next-limit-' + Math.random().toString(36).substring(2, 8)
}

/**
 * Creates and configures a new rate limiter instance.
 * This is the main entry point for using the library.
 *
 * The createRateLimiter function takes a configuration object that specifies
 * the rate limiting strategy, storage backend, optional prefix, and error handling policy.
 * It returns a RateLimiterInstance that can be used to check if requests are allowed.
 *
 * @param options The options for the rate limiter.
 * @param options.strategy The rate limiting strategy factory to use.
 * @param options.storage The storage instance to use.
 * @param options.prefix An optional prefix for storage keys. If not provided, a unique prefix is generated.
 * @param options.onError Defines the behavior when a storage error occurs.
 * @returns A `RateLimiterInstance` ready to be used.
 *
 * @example
 * ```typescript
 * const storage = createMemoryStorage();
 * const strategyFactory = createFixedWindowStrategy({
 *   windowMs: 60000, // 1 minute
 *   limit: 100,      // 100 requests per minute
 * });
 *
 * const limiter = createRateLimiter({
 *   strategy: strategyFactory,
 *   storage: storage,
 *   prefix: 'my-app', // Optional prefix
 *   onError: 'deny'   // Default behavior
 * });
 *
 * // Use the limiter
 * const result = await limiter.consume('user-id');
 * if (result.allowed) {
 *   // Process the request
 * } else {
 *   // Reject the request
 * }
 * ```
 */
export function createRateLimiter(
    options: CreateRateLimiterOptions
): RateLimiterInstance {
    // Determine the prefix
    const prefix = options.prefix ?? generateUniquePrefix()

    // Execute the strategy factory with the context
    const strategyInstance = options.strategy({
        storage: options.storage,
        prefix: prefix,
    })

    return new RateLimiter({
        strategy: strategyInstance,
        storage: options.storage,
        onError: options.onError,
    })
}

/**
 * Creates a `RedisStorage` instance.
 *
 * This function creates a new RedisStorage instance that uses Redis as the storage backend.
 * It's ideal for production and distributed environments where you need to share rate limiting
 * state across multiple application instances.
 *
 * @param redis An initialized and connected `RedisClientType` instance.
 * @returns A configured instance of `RedisStorage`.
 *
 * @example
 * ```typescript
 * import { createClient } from 'redis';
 *
 * const redisClient = createClient({
 *   url: 'redis://localhost:6379'
 * });
 * await redisClient.connect();
 *
 * const storage = createRedisStorage(redisClient);
 * ```
 */
export function createRedisStorage(redis: RedisClientType): Storage {
    return new RedisStorage(redis)
}

/**
 * Creates a `MemoryStorage` instance.
 * Useful for testing or single-process applications.
 *
 * This function creates a new MemoryStorage instance that uses an in-memory Map as the storage backend.
 * It's ideal for testing and development environments where you don't need to persist rate limiting
 * state or share it across multiple application instances.
 *
 * @returns A configured instance of `MemoryStorage`.
 *
 * @example
 * ```typescript
 * const storage = createMemoryStorage();
 * ```
 */
export function createMemoryStorage(): Storage {
    return new MemoryStorage()
}
