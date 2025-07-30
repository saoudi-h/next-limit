/**
 * @file Defines the core interfaces for rate limiting strategies.
 * This file specifies the contract that all rate limiting algorithms must follow,
 * as well as the structure of the result they must return.
 */

/**
 * Represents the result of a rate limit check.
 * This object provides information about whether the request was allowed,
 * how many requests are remaining, and when the limit will reset.
 */
export interface RateLimiterResult {
    /**
     * A boolean indicating whether the request is permitted.
     * `true` if the request is within the limit, `false` otherwise.
     */
    allowed: boolean
    /**
     * The number of requests left that can be made in the current time window.
     */
    remaining: number
    /**
     * The timestamp (in milliseconds since the Unix epoch) when the rate limit window will reset.
     * A client can use this to know when to retry a request.
     */
    reset: number
}

/**
 * Defines the contract for a rate limiting strategy.
 * A strategy encapsulates a specific algorithm (e.g., fixed-window, sliding-window)
 * for deciding whether to allow or deny a request based on its identifier.
 */
export interface RateLimitStrategy {
    /**
     * Applies the rate limiting logic for a given identifier.
     *
     * @param identifier A unique string identifying the client making the request (e.g., an IP address or user ID).
     * @returns A promise that resolves to a `RateLimiterResult` object containing the outcome of the check.
     */
    limit(identifier: string): Promise<RateLimiterResult>
}
