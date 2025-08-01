/**
 * @file Defines flexible types for interacting with Redis clients.
 * This allows for better abstraction and facilitates testing by decoupling
 * the storage implementation from a specific Redis client version.
 */

import type { RedisClientType as OriginalRedisClientType } from 'redis'

/**
 * A flexible type to accommodate different Redis client configurations.
 *
 * This generic type definition helps avoid strict type mismatches that can occur
 * with different versions or configurations of the `redis` package. It represents
 * the Redis client type with all modules disabled, which is the base type used
 * for type safety when working with Redis clients in this package.
 *
 * @see https://github.com/redis/node-redis/blob/HEAD/docs/client-configuration.md#reducing-boilerplate
 */
export type RedisClientType = OriginalRedisClientType<
    Record<string, never>,
    Record<string, never>,
    Record<string, never>
>

/**
 * Defines an interface for the Redis methods used by the package.
 *
 * This abstraction allows for easier mocking in tests and supports using
 * different Redis client implementations that adhere to this contract. It includes
 * only the Redis commands required by the rate limiter's storage implementation.
 *
 * Implement this interface to create custom Redis client adapters for different
 * Redis libraries or services.
 *
 * @example
 * ```typescript
 * class MyCustomRedisClient implements RedisLike {
 *   async get(key: string): Promise<string | null> {
 *     // Implementation for GET command
 *   }
 *   // ... other required methods
 * }
 * ```
 */
export interface RedisLike {
    get(key: string): Promise<string | null>
    set(
        key: string,
        value: string,
        options?: {
            EX?: number
            PX?: number
            NX?: boolean
            XX?: boolean
            KEEPTTL?: boolean
        }
    ): Promise<string | null>
    setEx(key: string, seconds: number, value: string): Promise<string | null>
    del(key: string): Promise<number>
    exists(key: string): Promise<number>
    incr(key: string): Promise<number>
    pExpire(key: string, milliseconds: number): Promise<boolean>
    zAdd(
        key: string,
        members: { score: number; value: string }[]
    ): Promise<number>
    zAdd(key: string, member: { score: number; value: string }): Promise<number>
    zRemRangeByScore(key: string, min: number, max: number): Promise<number>
    zCard(key: string): Promise<number>
    zRangeWithScores(
        key: string,
        start: number,
        stop: number
    ): Promise<Array<{ value: string; score: number }>>
    multi(): RedisMultiLike
    eval(
        script: string,
        options: { keys: string[]; arguments: string[] }
    ): Promise<unknown>
    isReady?: boolean
    connect?(): Promise<void>
}

/**
 * Defines an interface for the methods of a Redis `multi` command pipeline.
 *
 * This interface ensures that the pipeline operations used by the storage are
 * correctly typed and can be mocked for testing purposes. It represents a
 * chainable interface for queuing multiple Redis commands to be executed
 * atomically.
 *
 * @see https://redis.io/topics/transactions
 */
export interface RedisMultiLike {
    incr(key: string): this
    pExpire(key: string, milliseconds: number): this
    zAdd(key: string, member: { score: number; value: string }): this
    zRemRangeByScore(key: string, min: number, max: number): this
    zCard(key: string): this
    zRangeWithScores(key: string, start: number, stop: number): this
    exec(): Promise<unknown[]>
}
