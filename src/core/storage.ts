/**
 * @file Defines the storage adapter interface for the rate limiter.
 * This interface provides an abstraction layer for different storage backends,
 * allowing the rate limiter to be used with in-memory storage, Redis, or other
 * custom storage solutions.
 */

/**
 * Defines the contract for storage adapters.
 * Storage adapters are responsible for storing and retrieving rate limit data,
 * such as hit counts and timestamps.
 */
export interface StorageAdapter {
    /**
     * Increments the hit count for a given key within a specified time window.
     * This method is primarily used by the "fixed-window" strategy.
     *
     * @param key The unique identifier for the client being rate-limited (e.g., an IP address).
     * @param windowMs The duration of the time window in milliseconds. The key will be automatically expired after this period.
     * @returns A promise that resolves to an object containing the current hit count (`count`) and the key's time-to-live (`ttl`) in seconds.
     */
    increment(
        key: string,
        windowMs: number
    ): Promise<{ count: number; ttl: number }>

    /**
     * Executes a pre-loaded Lua script on the storage backend.
     * This method is essential for atomic operations required by complex strategies like "sliding-window".
     * It is typically used with a Redis-based storage adapter.
     *
     * @param sha The SHA1 hash of the Lua script to execute.
     * @param keys An array of key names to be passed to the script.
     * @param args An array of argument values to be passed to the script.
     * @returns A promise that resolves to a tuple containing:
     *          - `[0]`: A boolean indicating if the request is allowed (`true`) or denied (`false`).
     *          - `[1]`: The number of remaining requests allowed in the current window.
     *          - `[2]`: The timestamp (in seconds) when the rate limit will reset.
     */
    evalSha(
        sha: string,
        keys: string[],
        args: string[]
    ): Promise<[boolean, number, number]>

    /**
     * Loads a Lua script into the storage backend (e.g., Redis) and returns its SHA1 hash.
     * Pre-loading scripts improves performance by avoiding the need to send the full script with each `evalSha` call.
     *
     * @param script The Lua script content to load.
     * @returns A promise that resolves to the SHA1 hash of the loaded script.
     */
    scriptLoad(script: string): Promise<string>
}
