/**
 * @file Contains factory functions for creating rate limiter components.
 * This is the primary entry point for configuring and creating rate limiters.
 */

import { RedisClientType } from 'redis'
import { RateLimiter, RateLimiterInstance } from './core/rate-limiter'
import {
    FixedWindowStrategy,
    RateLimitStrategy,
    SlidingWindowStrategy,
} from './core/strategy'
import { MemoryStorage, RedisStorage, Storage } from './core/storage'

// --- Strategy Configuration Types ---

/**
 * Configuration for the Fixed Window strategy.
 */
export interface FixedWindowStrategyConfig {
    /** The duration of the time window in milliseconds. */
    windowMs: number
    /** The maximum number of requests allowed within the window. */
    limit: number
    /** An optional prefix for storage keys, specific to this strategy instance. */
    prefix?: string
}

/**
 * Configuration for the Sliding Window strategy.
 */
export interface SlidingWindowStrategyConfig {
    /** The duration of the time window in milliseconds. */
    windowMs: number
    /** The maximum number of requests allowed within the window. */
    limit: number
    /** An optional prefix for storage keys, specific to this strategy instance. */
    prefix?: string
}

// --- Factory Functions ---

/**
 * Creates a `FixedWindowStrategy` instance.
 *
 * @param config The configuration for the fixed window strategy.
 * @returns A configured instance of `FixedWindowStrategy`.
 */
export function createFixedWindowStrategy(
    config: FixedWindowStrategyConfig
): RateLimitStrategy {
    return new FixedWindowStrategy(
        config.windowMs,
        config.limit,
        config.prefix ?? 'next-limit'
    )
}

/**
 * Creates a `SlidingWindowStrategy` instance.
 *
 * @param config The configuration for the sliding window strategy.
 * @returns A configured instance of `SlidingWindowStrategy`.
 */
export function createSlidingWindowStrategy(
    config: SlidingWindowStrategyConfig
): RateLimitStrategy {
    return new SlidingWindowStrategy(
        config.windowMs,
        config.limit,
        config.prefix ?? 'next-limit'
    )
}

// --- Main Rate Limiter Factory ---

/**
 * Options for creating a rate limiter with the `createRateLimiter` factory.
 */
export interface CreateRateLimiterOptions {
    /**
     * The rate limiting strategy instance to use.
     * Create this using a strategy factory like `createFixedWindowStrategy`.
     */
    strategy: RateLimitStrategy

    /**
     * The storage instance to use.
     * Create this using a storage factory like `createMemoryStorage`.
     */
    storage: Storage

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
 * Creates and configures a new rate limiter instance.
 * This is the main entry point for using the library.
 *
 * @param options The options for the rate limiter.
 * @param options.strategy The rate limiting strategy instance to use.
 * @param options.storage The storage instance to use.
 * @param options.onError Defines the behavior when a storage error occurs.
 * @returns A `RateLimiterInstance` ready to be used.
 */
export function createRateLimiter(
    options: CreateRateLimiterOptions
): RateLimiterInstance {
    return new RateLimiter({
        strategy: options.strategy,
        storage: options.storage,
        onError: options.onError,
    })
}

/**
 * Creates a `RedisStorage` instance.
 *
 * @param redis An initialized and connected `RedisClientType` instance.
 * @returns A configured instance of `RedisStorage`.
 */
export function createRedisStorage(redis: RedisClientType): Storage {
    return new RedisStorage(redis)
}

/**
 * Creates a `MemoryStorage` instance.
 * Useful for testing or single-process applications.
 *
 * @returns A configured instance of `MemoryStorage`.
 */
export function createMemoryStorage(): Storage {
    return new MemoryStorage()
}
