/**
 * @file Implements an in-memory storage adapter.
 * This adapter is suitable for development, testing, or single-process applications
 * where data persistence is not required.
 */

import { StorageAdapter } from './storage'

/**
 * An in-memory storage adapter that uses a JavaScript `Map` to store rate limit data.
 * Expired entries are automatically cleared upon the next access.
 * This adapter is not suitable for distributed systems.
 */
export class MemoryStorageAdapter implements StorageAdapter {
    /**
     * The internal store for rate limit data.
     * Maps a key (e.g., IP address) to its hit count and expiration timestamp.
     * @private
     */
    private readonly store = new Map<
        string,
        { value: number; expiresAt: number }
    >()

    /**
     * Increments the hit count for a given key and sets an expiration date.
     * If the key is expired, it is reset before incrementing.
     *
     * @param key The unique identifier for the client.
     * @param windowMs The duration of the time window in milliseconds.
     * @returns A promise that resolves to an object containing the new hit count and the TTL in **milliseconds**.
     */
    async increment(
        key: string,
        windowMs: number
    ): Promise<{ count: number; ttl: number }> {
        const now = Date.now()
        let current = this.store.get(key)

        // Remove the entry if it has expired
        if (current && current.expiresAt < now) {
            this.store.delete(key)
            current = undefined
        }

        if (current) {
            // Entry exists and is not expired, just increment the value.
            const newValue = current.value + 1
            this.store.set(key, { ...current, value: newValue })
            const remainingTtl = current.expiresAt - now
            return { count: newValue, ttl: remainingTtl > 0 ? remainingTtl : 0 }
        } else {
            // New entry, set it with the full window.
            const expiresAt = now + windowMs
            this.store.set(key, { value: 1, expiresAt })
            return { count: 1, ttl: windowMs }
        }
    }

    /**
     * This method is not supported by the `MemoryStorageAdapter`.
     * @throws {Error} Always throws an error indicating that Lua scripts are not supported.
     */
    async evalSha(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        sha: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        keys: string[],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        args: string[]
    ): Promise<[boolean, number, number]> {
        // This method is intentionally not implemented for the memory adapter.
        // The parameters are included to match the StorageAdapter interface.
        throw new Error(
            'Lua scripts are not supported by the MemoryStorageAdapter. Use RedisStorageAdapter for sliding-window strategy.'
        )
    }

    /**
     * This method is not supported by the `MemoryStorageAdapter`.
     * @throws {Error} Always throws an error indicating that Lua scripts are not supported.
     */
    async scriptLoad(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        script: string
    ): Promise<string> {
        // This method is intentionally not implemented for the memory adapter.
        // The parameter is included to match the StorageAdapter interface.
        throw new Error(
            'Lua scripts are not supported by the MemoryStorageAdapter. Use RedisStorageAdapter for sliding-window strategy.'
        )
    }
}
