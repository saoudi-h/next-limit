/**
 * @file Implements a storage adapter for Redis.
 * This adapter is ideal for production environments and distributed systems,
 * providing a scalable and persistent storage backend.
 */

import { RedisClientType } from 'redis'
import { StorageAdapter } from './storage'

/** The result type from the Redis `MULTI` command execution in the `increment` method. */
type RedisMultiExecResult = [number, string]

/**
 * A storage adapter that uses Redis as the backend.
 * It leverages Redis's atomic operations to ensure consistency in a distributed environment.
 * This adapter is required for the "sliding-window" strategy.
 */
export class RedisStorageAdapter implements StorageAdapter {
    /**
     * Creates a new instance of the `RedisStorageAdapter`.
     * @param redis An initialized and connected `RedisClientType` instance from the `redis` package.
     */
    constructor(private readonly redis: RedisClientType) {}

    /**
     * Atomically increments a key and sets its expiration time in a single transaction.
     * This method is used by the "fixed-window" strategy.
     *
     * @param key The unique identifier for the client.
     * @param windowMs The duration of the time window in milliseconds.
     * @returns A promise that resolves to an object containing the new hit count and the TTL in **milliseconds**.
     */
    async increment(
        key: string,
        windowMs: number
    ): Promise<{ count: number; ttl: number }> {
        const multi = this.redis.multi()
        multi.incr(key)
        multi.pExpire(key, windowMs)
        const [count] = (await multi.exec()) as unknown as RedisMultiExecResult
        return { count, ttl: windowMs }
    }

    /**
     * Executes a pre-loaded Lua script on Redis using the `EVALSHA` command.
     * This is essential for the "sliding-window" strategy, which relies on a Lua script for atomic evaluation.
     *
     * @param sha The SHA1 hash of the script to execute.
     * @param keys An array of key names to be passed to the script.
     * @param args An array of argument values to be passed to the script.
     * @returns A promise that resolves to the tuple returned by the Lua script.
     */
    async evalSha(
        sha: string,
        keys: string[],
        args: string[]
    ): Promise<[boolean, number, number]> {
        return this.redis.evalSha(sha, { keys, arguments: args }) as Promise<
            [boolean, number, number]
        >
    }

    /**
     * Loads a Lua script into Redis using the `SCRIPT LOAD` command.
     *
     * @param script The Lua script content to load.
     * @returns A promise that resolves to the SHA1 hash of the loaded script.
     */
    async scriptLoad(script: string): Promise<string> {
        return this.redis.scriptLoad(script)
    }
}
