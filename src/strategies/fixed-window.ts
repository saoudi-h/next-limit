/**
 * @file Implements the fixed-window rate limiting strategy.
 */

import { StorageAdapter } from '../core/storage'
import { RateLimitStrategy, RateLimiterResult } from '../core/strategy'

/**
 * Implements the fixed-window rate limiting algorithm.
 * This strategy counts requests within a fixed time window (e.g., 100 requests per hour).
 * It is simple and efficient, making it a good choice for many use cases.
 * However, it can allow a burst of traffic to exceed the limit near the window's edge.
 */
export class FixedWindowStrategy implements RateLimitStrategy {
    /**
     * Creates a new instance of the `FixedWindowStrategy`.
     *
     * @param storage The storage adapter used to store hit counts.
     * @param windowMs The duration of the time window in milliseconds.
     * @param _limit The maximum number of requests allowed within the window.
     * @param prefix A prefix for storage keys to avoid collisions.
     */
    constructor(
        private readonly storage: StorageAdapter,
        private readonly windowMs: number,
        private readonly _limit: number,
        private readonly prefix: string
    ) {}

    /**
     * Applies the fixed-window rate limiting logic.
     * It increments a counter for the given identifier and checks if it exceeds the limit.
     *
     * @param identifier The unique identifier for the client.
     * @returns A promise that resolves to a `RateLimiterResult` object.
     */
    async limit(identifier: string): Promise<RateLimiterResult> {
        const key = `${this.prefix}:fixed-window:${identifier}`
        const now = Date.now()

        // Increment the counter for the current window.
        const { count } = await this.storage.increment(key, this.windowMs)

        const allowed = count <= this._limit
        const remaining = allowed ? this._limit - count : 0

        return {
            allowed,
            remaining: Math.max(0, remaining),
            // The reset time is calculated from the start of the request, not the window's actual start.
            reset: now + this.windowMs,
        }
    }
}
