/**
 * @file Contains the core RateLimiter class and related types.
 */

import { RateLimiterResult, RateLimitStrategy } from './strategy'
import { StorageAdapter } from './storage'
import { FixedWindowStrategy } from '../strategies/fixed-window'
import { SlidingWindowStrategy } from '../strategies/sliding-window'

/**
 * Defines the names for the built-in rate limiting strategies.
 */
export type BuiltInStrategyName = 'fixed-window' | 'sliding-window'

/**
 * Options for creating a `RateLimiter` instance.
 */
export interface RateLimiterOptions {
    /**
     * The storage adapter to use for persisting rate limit data.
     */
    storage: StorageAdapter

    /**
     * The rate limiting strategy to use.
     * It can be the name of a built-in strategy or a custom `RateLimitStrategy` instance.
     */
    strategy: BuiltInStrategyName | RateLimitStrategy

    /**
     * The duration of the rate limit window in milliseconds.
     */
    windowMs: number

    /**
     * The maximum number of requests allowed within the window.
     */
    limit: number

    /**
     * An optional prefix for storage keys to avoid collisions.
     * @default 'ratelimit'
     */
    prefix?: string

    /**
     * Defines the behavior when a rate limit is exceeded.
     * - 'allow': The request is allowed to proceed.
     * - 'deny': The request is denied (default).
     * - 'throw': An error is thrown.
     * @default 'deny'
     */
    onError?: 'allow' | 'deny' | 'throw'
}

/**
 * A flexible and extensible rate limiter for Node.js applications.
 * It supports various strategies and can be adapted to different storage backends.
 */
export class RateLimiter {
    private readonly strategy: RateLimitStrategy
    private readonly onError: 'allow' | 'deny' | 'throw'
    private readonly limit: number // Needed for fallback in handleStorageError

    /**
     * Creates a new `RateLimiter` instance.
     *
     * @param options - The options for the rate limiter.
     */
    constructor(options: RateLimiterOptions) {
        this.onError = options.onError ?? 'deny'
        this.limit = options.limit

        if (typeof options.strategy === 'string') {
            const prefix = options.prefix ?? 'ratelimit'
            switch (options.strategy) {
                case 'fixed-window':
                    this.strategy = new FixedWindowStrategy(
                        options.storage,
                        options.windowMs,
                        options.limit,
                        prefix
                    )
                    break
                case 'sliding-window':
                    this.strategy = new SlidingWindowStrategy(
                        options.storage,
                        options.windowMs,
                        options.limit,
                        prefix
                    )
                    break
                default:
                    throw new Error(
                        `Unknown built-in strategy: ${options.strategy}`
                    )
            }
        } else {
            // TODO: strategy must be a factory function that takes storage, windowMs, limit, and prefix as arguments and returns a RateLimitStrategy instance
            this.strategy = options.strategy
        }
    }

    /**
     * Wraps a promise to handle potential storage errors based on the `onError` option.
     * @param promise The promise to wrap, typically a call to the storage adapter.
     * @private
     */
    private async handleStorageError<T>(
        promise: Promise<T>
    ): Promise<T | RateLimiterResult> {
        try {
            return await promise
        } catch (error) {
            console.error('Rate limiter storage error:', error)
            switch (this.onError) {
                case 'allow':
                    // Allow the request if the storage is down, providing the configured limit as remaining.
                    return {
                        allowed: true,
                        remaining: this.limit,
                        reset: Date.now(),
                    }
                case 'throw':
                    throw error
                case 'deny':
                default:
                    // Deny the request if the storage is down
                    return { allowed: false, remaining: 0, reset: Date.now() }
            }
        }
    }

    /**
     * Checks and registers a hit for a given identifier.
     * This is the primary method to be called for each request.
     *
     * @param identifier A unique string identifying the client (e.g., IP address).
     * @returns A promise that resolves to a `RateLimiterResult`.
     */
    async hit(identifier: string): Promise<RateLimiterResult> {
        return this.handleStorageError(
            this.strategy.limit(identifier)
        ) as Promise<RateLimiterResult>
    }

    /**
     * An alias for the `hit` method.
     *
     * @param identifier A unique string identifying the client (e.g., IP address).
     * @returns A promise that resolves to a `RateLimiterResult`.
     * @see hit
     */
    async isAllowed(identifier: string): Promise<RateLimiterResult> {
        return this.hit(identifier)
    }
}
