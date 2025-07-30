/**
 * @file Implements the sliding-window rate limiting strategy using a Lua script.
 */

import { StorageAdapter } from '../core/storage'
import { RateLimitStrategy, RateLimiterResult } from '../core/strategy'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Implements the sliding-window rate limiting algorithm using a Lua script for atomic operations.
 * This strategy provides a more accurate rate limit by using a rolling time window,
 * which prevents bursts of traffic at the edges of the window.
 *
 * It requires a `RedisStorageAdapter` as it depends on the `EVALSHA` command to run the script.
 */
export class SlidingWindowStrategy implements RateLimitStrategy {
    /**
     * The SHA1 hash of the loaded Lua script.
     * It is cached to avoid reloading the script on every request.
     * @private
     */
    private scriptSha: string | null = null

    /**
     * Creates a new instance of the `SlidingWindowStrategy`.
     *
     * @param storage The storage adapter. Must support Lua scripts (e.g., `RedisStorageAdapter`).
     * @param windowMs The duration of the sliding window in milliseconds.
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
     * Loads the Lua script from the file system into the storage backend and caches its SHA1 hash.
     * If the script has already been loaded, it returns the cached SHA immediately.
     * @private
     * @returns A promise that resolves to the SHA1 hash of the script.
     */
    private async loadScript(): Promise<string> {
        if (this.scriptSha) {
            return this.scriptSha
        }

        const scriptPath = path.join(__dirname, '../scripts/sliding-window.lua')
        const script = fs.readFileSync(scriptPath, 'utf8')
        this.scriptSha = await this.storage.scriptLoad(script)
        return this.scriptSha
    }

    /**
     * Applies the sliding-window rate limiting logic by executing the Lua script.
     *
     * @param identifier The unique identifier for the client.
     * @returns A promise that resolves to a `RateLimiterResult` object returned by the script.
     */
    async limit(identifier: string): Promise<RateLimiterResult> {
        const key = `${this.prefix}:sliding-window:${identifier}`
        const now = Date.now()

        const scriptSha = await this.loadScript()

        // Execute the Lua script atomically on the storage server.
        const result = (await this.storage.evalSha(
            scriptSha,
            [key], // KEYS[1]
            [now.toString(), this.windowMs.toString(), this._limit.toString()] // ARGV[1], ARGV[2], ARGV[3]
        )) as [boolean, number, number]

        return {
            allowed: result[0],
            remaining: result[1],
            reset: result[2],
        }
    }
}
