/**
 * @file Contains the core RateLimiter class and related types.
 */

import { RateLimiterResult, RateLimitStrategy } from './strategy'
import { Storage } from './storage'

/**
 * Defines the public interface for a rate limiter instance.
 * This is what the factory function `createRateLimiter` will return.
 *
 * The RateLimiterInstance provides a simple interface for consuming rate limit points
 * and checking if requests are allowed based on the configured strategy.
 */
export interface RateLimiterInstance {
    /**
     * Consumes a point for a given identifier.
     * This is the primary method to be called for each request to be rate-limited.
     *
     * @param identifier A unique string identifying the client (e.g., IP address).
     * @returns A promise that resolves to a `RateLimiterResult`.
     */
    consume(identifier: string): Promise<RateLimiterResult>
}

/**
 * Internal options for creating a `RateLimiter` instance.
 * This is not part of the public API.
 * @internal
 */
export interface InternalRateLimiterOptions {
    strategy: RateLimitStrategy
    storage: Storage
    onError?: 'allow' | 'deny' | 'throw'
}

/**
 * A flexible and extensible rate limiter for Node.js applications.
 * This class is not meant to be instantiated directly.
 * Use the `createRateLimiter` factory function instead.
 *
 * The RateLimiter class wraps a rate limiting strategy and provides error handling
 * capabilities. It's responsible for consuming rate limit points and returning
 * the result of the rate limiting check.
 *
 * @internal
 */
export class RateLimiter implements RateLimiterInstance {
    private readonly strategy: RateLimitStrategy
    private readonly storage: Storage
    private readonly onError: 'allow' | 'deny' | 'throw'

    /**
     * Creates a new RateLimiter instance.
     *
     * @param options The options for creating the rate limiter.
     * @param options.strategy The rate limiting strategy to use.
     * @param options.storage The storage instance to use.
     * @param options.onError The error handling policy.
     */
    constructor(options: InternalRateLimiterOptions) {
        this.strategy = options.strategy
        this.storage = options.storage
        this.onError = options.onError ?? 'deny'
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
                    // If the storage is down, allow the request.
                    return {
                        allowed: true,
                        limit: -1,
                        remaining: -1,
                        reset: -1,
                    }
                case 'throw':
                    throw error
                case 'deny':
                default:
                    // If the storage is down, deny the request.
                    return {
                        allowed: false,
                        limit: -1,
                        remaining: -1,
                        reset: -1,
                    }
            }
        }
    }

    /**
     * Consumes a point for a given identifier.
     * This is the primary method to be called for each request to be rate-limited.
     *
     * @param identifier A unique string identifying the client (e.g., IP address).
     * @returns A promise that resolves to a `RateLimiterResult`.
     */
    async consume(identifier: string): Promise<RateLimiterResult> {
        return this.handleStorageError(
            this.strategy.limit(identifier)
        ) as Promise<RateLimiterResult>
    }
}
