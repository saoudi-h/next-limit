/**
 * @file Defines the main RateLimiter class and its configuration options.
 * This is the primary entry point for using the rate limiting library.
 */

import { RateLimiterResult, RateLimitStrategy } from './strategy'

/**
 * Configuration options for the `RateLimiter`.
 */
export interface RateLimiterOptions {
    /**
     * An instance of a rate limiting strategy.
     * e.g., `FixedWindowStrategy` or `SlidingWindowStrategy`.
     */
    strategy: RateLimitStrategy
    /**
     * The maximum number of requests allowed in the window, used for fallback logic.
     */
    limit: number
    /**
     * Defines the behavior when an error occurs with the storage adapter.
     * - `allow`: The request is allowed.
     * - `deny`: The request is denied (default).
     * - `throw`: The error is re-thrown.
     */
    onError?: 'allow' | 'deny' | 'throw'
}

/**
 * The main class for rate limiting.
 * It orchestrates the selected strategy and storage adapter to perform rate limiting checks.
 */
export class RateLimiter {
    private readonly strategy: RateLimitStrategy
    private readonly onError: 'allow' | 'deny' | 'throw'
    private readonly limit: number

    /**
     * Creates a new `RateLimiter` instance.
     * @param options The configuration options for the rate limiter.
     */
    constructor(options: RateLimiterOptions) {
        this.strategy = options.strategy
        this.onError = options.onError ?? 'deny'
        this.limit = options.limit
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
